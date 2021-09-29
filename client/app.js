/**
 * @author: guangzhen.ju.o
 * @date: 27/09/2021 14:51
 * */
import axios from 'axios'

let app = axios.create({
  timeout: 5 * 1000
})

export default app

