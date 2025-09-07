import axios from '../../../node_modules/axios/index'

interface ITvConfig {
  spider: string
  wallpaper: string
}

const axiosTs = () => {
  // 较老的版本- response无统一的wrap
  axios.get<ITvConfig>('https://blog.heroking.top/tv/tv.json').then((res) => {
    console.log(res.data.spider)
  })

  // axios带拦截器
  axios.get<any, ITvConfig>('https://blog.heroking.top/tv/tv.json').then((res) => {
    console.log(res.spider)
  })

  // 比较新的版本 加入了axios函数的泛型
  axios<ITvConfig>('https://blog.heroking.top/tv/tv.json').then((res) => {
    console.log(res.data.spider)
  })
}

interface ISystemResponse<T = any> {
  errorCode: number
  errorMsg: string
  data: T
}

const sleep = (time: number = 1000) => {
  return new Promise((res) => {
    setTimeout(res, time)
  })
}

// 使用接口形式书写函数, 实现约定参数类型
interface FunctionCall<R, T = any> {
  (data: T): R
}
// const requestRetry = async <T extends ISystemResponse>(fn: () => Promise<T>,retry: number = 3,delay: number = 5,validSuccess: (data: ReturnType<typeof fn> extends Promise<infer T> ? T : never) => boolean = (data) => data && data.errorCode == 0)
const requestRetry = async <T extends ISystemResponse>(
  fn: () => Promise<T>,
  retry: number = 3,
  delay: number = 5,
  //   使用ReturnType拿到fn函数返回值类型,使用infer 推断泛型T的类型
  validSuccess: FunctionCall<boolean, ReturnType<typeof fn> extends Promise<infer T> ? T : never> = (data) => data && data?.errorCode == 0
) => {
  let res = null,
    err = null
  for (let i = 0; i < retry; i++) {
    try {
      const data = await fn()
      if (validSuccess(data)) {
        res = data
        break
      } else {
        throw new Error(data?.errorMsg ?? '接口重试调用失败!')
      }
    } catch (error) {
      if (i + 1 == retry) {
        err = error
      } else {
        await sleep(delay * 1000)
      }
    }
  }
  return err ? Promise.reject(err) : res
}
const testRequestRetry = () => {
  let count = 0
  const getJson = () => {
    return axios.get<ITvConfig>('https://blog.heroking.top/tv/tv.json').then((res) => ({ errorCode: count++, errorMsg: '', data: res.data }))
  }

  requestRetry(getJson, 3, 1, (data) => data.errorCode === 2)
    .then((res) => {
      console.log(res, 'retry result')
    })
    .catch((err) => {
      console.log(err.message, 'retry error')
    })
}
testRequestRetry()
