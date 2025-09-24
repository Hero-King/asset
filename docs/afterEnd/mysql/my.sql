-- 银行理财产品年化计算
-- 银行理财产品年化计算
DELIMITER //

-- 主存储过程：刷新年化收益率
DROP PROCEDURE IF EXISTS RefreshAnnualizedYield;

DELIMITER //

CREATE PROCEDURE RefreshAnnualizedYield(IN calc_date DATE)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_product_code VARCHAR(50);
    
    -- 只获取产品代码，不获取名称和平台
    DECLARE product_cursor CURSOR FOR 
        SELECT DISTINCT product_code FROM financial_products WHERE is_active = TRUE;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- 如果未传入日期，则默认计算昨天
    IF calc_date IS NULL THEN
        SET calc_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY);
    END IF;
    
    OPEN product_cursor;
    
    -- 循环处理每个产品
    read_loop: LOOP
        FETCH product_cursor INTO v_product_code;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- 只传递产品代码，不传递名称和平台
        CALL CalculateAndUpsertYield(v_product_code, calc_date, '7', 7);
        CALL CalculateAndUpsertYield(v_product_code, calc_date, '30', 30);
        CALL CalculateAndUpsertYield(v_product_code, calc_date, '90', 90);
        
    END LOOP;
    
    CLOSE product_cursor;
END //

DELIMITER ;

-- 子存储过程：计算单个产品单个维度的年化
DROP PROCEDURE IF EXISTS CalculateAndUpsertYield;

DELIMITER //

CREATE PROCEDURE CalculateAndUpsertYield(
    IN p_product_code VARCHAR(50),
    IN p_calc_date DATE,
    IN p_yield_type VARCHAR(10),
    IN p_target_days INT
)
proc_block: BEGIN
    DECLARE v_end_date DATE;
    DECLARE v_start_date DATE;
    DECLARE v_earliest_date DATE;
    DECLARE v_end_net_value DECIMAL(12,6);
    DECLARE v_start_net_value DECIMAL(12,6);
    DECLARE v_annualized_yield DECIMAL(8,4);
    DECLARE v_actual_days INT;
    DECLARE v_product_exists INT;
    
    -- 检查产品是否存在且有效
    SELECT COUNT(*) INTO v_product_exists 
    FROM financial_products 
    WHERE product_code = p_product_code AND is_active = TRUE;
    
    IF v_product_exists = 0 THEN
        LEAVE proc_block;
    END IF;
    
    -- 1. 获取计算截止日期（计算日期之前的最新净值日期）
    SELECT MAX(value_date) INTO v_end_date
    FROM financial_product_netvalues
    WHERE product_code = p_product_code 
    AND value_date <= p_calc_date;
    
    -- 如果连结束日的净值都没有，直接返回
    IF v_end_date IS NULL THEN
        LEAVE proc_block;
    END IF;
    
    -- 2. 获取该产品的最早净值日期
    SELECT MIN(value_date) INTO v_earliest_date
    FROM financial_product_netvalues
    WHERE product_code = p_product_code;
    
    -- 3. 智能计算开始日期：从结束日期往前推(p_target_days-1)天
    SELECT MAX(value_date) INTO v_start_date
    FROM financial_product_netvalues
    WHERE product_code = p_product_code 
    AND value_date <= DATE_SUB(v_end_date, INTERVAL (p_target_days - 1) DAY);
    
    -- 4. 如果找不到合适的开始日期（比如数据太少），则使用最早可用的净值日期
    IF v_start_date IS NULL THEN
        SET v_start_date = v_earliest_date;
        
        -- 如果最早日期就是结束日期（只有一天数据），无法计算年化，直接返回
        IF v_start_date = v_end_date THEN
            LEAVE proc_block;
        END IF;
    END IF;
    
    -- 5. 获取开始和结束日的净值
    SELECT net_value INTO v_start_net_value
    FROM financial_product_netvalues
    WHERE product_code = p_product_code 
    AND value_date = v_start_date;
    
    SELECT net_value INTO v_end_net_value
    FROM financial_product_netvalues
    WHERE product_code = p_product_code 
    AND value_date = v_end_date;
    
    -- 6. 计算实际经过的自然日天数（包含首尾）
    SET v_actual_days = DATEDIFF(v_end_date, v_start_date) + 1;
    
    -- 7. 如果有足够数据，则计算年化
    IF v_start_net_value IS NOT NULL AND v_end_net_value IS NOT NULL 
       AND v_start_net_value > 0 AND v_actual_days > 1 THEN
        
        -- 核心年化计算公式
        SET v_annualized_yield = (POW(v_end_net_value / v_start_net_value, 365 / v_actual_days) - 1) * 100;
        
        -- 8. 插入或更新年化数据表（不再存储product_name和sale_platform）
        INSERT INTO product_annualized_yield 
            (product_code, calculation_date, yield_type, annualized_yield, 
             start_date, end_date)
        VALUES 
            (p_product_code, p_calc_date, p_yield_type, v_annualized_yield, 
             v_start_date, v_end_date)
        ON DUPLICATE KEY UPDATE
            annualized_yield = v_annualized_yield,
            start_date = v_start_date,
            end_date = v_end_date;
    END IF;
    
END //

DELIMITER ;

-- 产品收益排行榜（Table面板）
SELECT 
    product_code as "产品代码",
    product_name as "产品名称",
    sale_platform as "销售平台",
    MAX(CASE WHEN yield_type = '7' THEN annualized_yield END) as "近7日年化(%)",
    MAX(CASE WHEN yield_type = '30' THEN annualized_yield END) as "近30日年化(%)",
    MAX(CASE WHEN yield_type = '90' THEN annualized_yield END) as "近90日年化(%)",
    MAX(calculation_date) as "最后更新"
FROM product_annualized_yield
WHERE calculation_date = (SELECT MAX(calculation_date) FROM product_annualized_yield)
GROUP BY product_code, product_name, sale_platform
ORDER BY MAX(CASE WHEN yield_type = '7' THEN annualized_yield END) DESC