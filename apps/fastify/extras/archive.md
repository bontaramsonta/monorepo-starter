# Archive

## [**mongo**] category redirectUrl Fixer
```js
  function redirectUrlGenerator(s) {
    return s.trim().replaceAll(/[<>()'"%!$#@*^.?:;|\\+_=*]/g, "").replaceAll(/[ ,.]/g, "-").replaceAll("&", "and").replaceAll(/--*/g, "-").toLowerCase()
  }
  console.log("[main]")
  let redirectUrls = await client.db("marketplace").collection("productcategories").find({}, {
    redirectUrl: 1,
    title: 1
  }).toArray()
  //! for extra test cases
  // redirectUrls.push(additional)
  let re = []
  await Promise.all(redirectUrls.map(async (cat, i) => {
    if(!cat.isDeleted) {
      let newRedirectUrl = redirectUrlGenerator(cat.redirectUrl)
      let c = 0
      re.forEach(r => r === newRedirectUrl ? c++ : null)
      if (c !== 0) {
        newRedirectUrl += c
        console.log("[deDuped]",newRedirectUrl)
      }
      re.push(newRedirectUrl)
      console.log(`[${cat.title}]`, cat.redirectUrl, "=>", newRedirectUrl)
      return await client.db("marketplace").collection("productcategories").updateOne({ _id: cat._id }, { $set: { redirectUrl: newRedirectUrl } })
    }
  }))
  console.log("[done]")
```