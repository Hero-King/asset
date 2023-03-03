/**
 * @description 冒泡排序: 循环比较当前位置和下一个位置的数字大小,大->交换 一轮下来最大值到了数组的最右侧 循环n次 O(n²)
 * @param {number[]} arr
 */
function bubbleSort(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1)
      }
    }
  }
}

/**
 * @description 选择排序: 第一次遍历所有数据, 记录最小的数字下标,一次遍历完成交换下标的数字和第一个位置的数据  O(n²)
 * @param {number []} arr
 */
function selectSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    if (i !== minIndex) {
      swap(arr, i, minIndex)
    }
  }
}

/**
 * @description 插入排序: 每次循环都保证前n个数字有序 循环内容: 拿到一个数字,跟前面的第一个第二个数字比较,小于就交换位置 O(n²) 取决于数据的结构,如果数据本生有一定的顺序,一次循环将不会操作n次 时间复杂度就不会达到O(n²) 最优是o(n)
 * 类似打扑克牌时候的抓牌插入排序
 * @param {num []} arr
 */
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let j = i
    while (i >= 1 && arr[j] < arr[j - 1]) {
      swap(arr, j - 1, j)
      j--
    }
  }
}

// 交互数组两个位置的数据
function swap(arr, leftIndex, rightIndex) {
  arr[leftIndex] = arr[leftIndex] ^ arr[rightIndex]
  arr[rightIndex] = arr[leftIndex] ^ arr[rightIndex]
  arr[leftIndex] = arr[leftIndex] ^ arr[rightIndex]
}

/**
 * 归并排序使用 迭代器形式
 * @param {number []} arr
 * @returns
 */
function mergeSortFor(arr) {
  if (arr.length < 2) {
    return arr
  }
  for (let p = 1; p < arr.length; p *= 2) {
    let step = p * 2
    for (let j = 0; j * step < arr.length; j++) {
      let left = j * step
      let right = Math.min(arr.length - 1, left + step - 1)
      let middle = Math.min(arr.length - 1, left + p - 1)
      mergeArr(arr, left, middle, right)
    }
  }
}

/**
 * @description 归并排序 把数组拆成两个数组,分别排序,剩下的就是合并两个有序数组  应用: 小和问题 和逆序对问题
 * @param {number []} arr
 */
function mergeSort(arr) {
  if (arr.length < 2) {
    return arr
  }
  process(arr, 0, arr.length - 1)
}

/**
 * 对数组中left 到right 位置内的数据排序
 * @param {number []} arr
 * @param {*} left
 * @param {*} right
 * @returns
 */
function process(arr, left, right) {
  if (left >= right) {
    return
  }
  const middle = left + ((right - left) >> 1)
  process(arr, left, middle)
  process(arr, middle + 1, right)
  mergeArr(arr, left, middle, right)
}

/**
 * 对数组中(left, middle)排序好的数据 和 (middle,right)排序好的数据 合并 o(n)
 * @param {*} arr
 * @param {*} left
 * @param {*} middle
 * @param {*} right
 */
function mergeArr(arr, left, middle, right) {
  let i = left
  let j = middle + 1
  let index = 0
  let res = []
  while (i <= middle && j <= right) {
    res[index++] = arr[i] > arr[j] ? arr[j++] : arr[i++]
  }
  while (i <= middle) {
    res[index++] = arr[i++]
  }
  while (j <= right) {
    res[index++] = arr[j++]
  }
  res.forEach((i, inde) => (arr[left + inde] = i))
}

/**
 * @description 快排序 取序列中间的数字,大于他的放右边,小于他的放左边 时间复杂度o(n * logn)  空间复杂度好的情况 o(logn) 坏情况o(n)
 * @param {number []} arr
 */
function quickSort(arr) {
  if (arr.length < 2) {
    return arr
  }
  let middle = arr[arr.length >> 1]
  let left = []
  let right = []
  arr.forEach((item, index) => {
    let value = arr[index]
    if (value > middle) {
      right.push(value)
    } else if (value < middle) {
      left.push(value)
    }
  })
  return quickSort(left).concat(middle, quickSort(right))
}

/**
 * 往堆里面插入小标是idnex的数据,使得符合大根堆或者小根堆结构
 * heapify: 堆中移除最大值,之后取堆中最后一个数据放到根节点,和两个孩子最大值比较,小于最大值交换,一直排序下去
 * heapInsert 和 heapify 都是o(logn)
 * 堆排序 一开始heapSize=0,1,2,3 把堆创建出来 去最大值放在数组最右边执行heapify 时间o(nlogn) 空间o(1)
 * @param {number []} arr
 * @param {number} index
 */
function heapInsert(arr, index) {
  if (index < 1) return
  let i = index
  let parent = (i - 1) >> 1
  while (parent >= 0 && arr[i] > arr[parent]) {
    swap(arr, i, parent)
    i = parent
    parent = (i - 1) >> 1
  }
}
let heapInsertTest = [5, 2, 3, 6]
heapInsert(heapInsertTest, 3)
// console.log(heapInsertTest)

let testArr = [10, -10, 2, 3, 7, 1]
// bubbleSort(testArr)
// selectSort(testArr)
// insertSort(testArr)
// mergeSort(testArr)
// mergeSortFor(testArr)
console.log(testArr)
let res = quickSort(testArr)
console.log(res)

// 稳定性: 相同数字排序后,相对次序和之前的顺序相同 称为稳定  (出现两个或者多个关键词排序时候用得到)
// 不稳定的: 选择排序 快排 堆排序
// 稳定的: 冒泡排序 插入排序 归并排序
