# 钉钉

## 免登陆

1. 获取免登授权码。 code 只能使用一次 并且 5 分钟内失效

2. 获取 AccessToken。调用接口获取 access_token，详情请参考获取企业内部应用的 access_token(有效期 2h 有效期内重复获取会返回相同结果并自动续期, 每个应用的 accessToken 是彼此独立的)

3. userid。调用接口获取用户的 userid，详情请参考通过免登码获取用户信息。能够拿到 userid, device_id(设备 id) associated_unionid(用户关联的 unionId) unionid(用户 unionId) name

4. 获取用户详情。调用接口获取用户详细信息，详情请参考查询用户详情。

## H5 的各种 id

### 微信

- openid 普通用户的标识，不管是 微信公众号 还是 微信小程序，二者都是在微信公众平台进行管理的，所以他俩就放一起讲，为了识别用户，每个微信用户针对每个 公众号 或者 小程序 会产生一个安全的 OpenID
- UnionID 用户统一标识，针对一个微信开放平台帐号下的应用，同一用户的 unionid 是唯一的

### 钉钉

<a href="https://open.dingtalk.com/document/orgapp/basic-concepts">参考</a>

- userid 每个钉钉用户都有一个唯一的 userid，用于在钉钉系统中唯一标识一个用户, 创建后不可修改。
- unionid：unionid 是一个跨应用的用户唯一标识符，用于将同一个用户在不同应用之间进行关联。 当一个用户在多个使用钉钉开放平台的应用中登录时，他们的 unionid 会保持一致。 这样可以方便开发者在多个应用之间实现用户信息的共享和关联。
- staffId：staffId 是企业内部员工的工号，用于在企业内部标识员工的唯一标识符。 它通常由企业自己的人力资源系统或员工管理系统提供，并与钉钉系统进行对接，以便在钉钉中进行员工身份认证和管理
