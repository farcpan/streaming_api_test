# streaming_api_test

for Streaming API Test of API Gateway (RestAPI)

---

## Dependencies

```bash
npm install --save-dev aws-lambda
npm install --save-dev esbuild@0
npm install --save-dev @types/aws-lambda
```

---

## How to use

API URL: `https://<api_id>.execute-api.ap-northeast-1.amazonaws.com/api/stream`

```bash
curl https://<api_id>.execute-api.ap-northeast-1.amazonaws.com/api/stream
{"chunk":"H","index":0}
{"chunk":"e","index":1}
{"chunk":"l","index":2}
{"chunk":"l","index":3}
{"chunk":"o","index":4}
{"chunk":" ","index":5}
{"chunk":"S","index":6}
{"chunk":"t","index":7}
{"chunk":"r","index":8}
{"chunk":"e","index":9}
{"chunk":"a","index":10}
{"chunk":"m","index":11}
{"chunk":"i","index":12}
{"chunk":"n","index":13}
{"chunk":"g","index":14}
{"chunk":" ","index":15}
{"chunk":"A","index":16}
{"chunk":"P","index":17}
{"chunk":"I","index":18}
{"chunk":"!","index":19}
```