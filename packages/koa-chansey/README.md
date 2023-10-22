# uswitch/koa-chansey

> A lightweight Koa middleware to integrate into Recharge Chansey. Exposes experiences onto the
> request context.

### Example usage
```
import { experiences } from '@uswitch/koa-chansey'

router.get(experiences({
  url: 'https://your-chansey-url',
  timeout: 1000
}))
```

### Options

`url`: The Chansey server url, or `DISABLED` to skip

`timeout`: A timeout for Chansey requests in ms, default is 1000

### Disabling

Will be disabled and skip fetching experiences if
* url is `DISABLED`
* environment variable `CHANSEY_DISABLED` is set
* http heading `X-Skip-Experiences` is set on a request