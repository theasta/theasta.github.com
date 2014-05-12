---
layout: post
title: "new Date('2012/01/01') vs new Date('2012-01-01')"
date: 2012-02-12 20:13
comments: true
categories: 
---

When creating a JavaScript date object using a dateString parameter, I expect it to be interpreted in my local time.

<!-- more -->

For example, since I'm living in Vancouver, 

```javascript
new Date('January 1, 2012')
//or
new Date('2012/01/01')
```

returns in Chrome

```
"Tue Jan 01 2012 00:00:00 GMT-0800 (PST)".
```

If I was in Paris, it would return

```
"Tue Jan 01 2012 00:00:00 GMT+0100"
```

etc..

So far so good ! Until I discovered today that a very minor change in my dateString format could make the Date constructor behave unpredictably. Indeed :

```javascript
new Date('2012-01-01')
```

returns in Chrome

```
Mon Dec 31 2011 16:00:00 GMT-0800 (PST)
```

Which is actually Tue Jan 01 2012 00:00:00 **but GMT**.
My date string was interpreted in **universal time instead of local time**.

It's all but trivial since:
```javascript
new Date('2012-01-01').getFullYear() //will return 2011 if you're behind GMT !!
```

###  ISO 8601 format

The thing is "2012-01-01" is a ISO 8601 format, which support started with javascript 1.8.5.
As "2012/01/01" is a shorthand for "2012/01/01 00:00:00", "2012-01-01" stands for "2012-01-01T00:00:00".
Unfortunately, "2012-01-01T00:00:00" implies **GMT timezone**. If I want to get Jan 1, 2012 in Vancouver time, I have to use "2012-01-01T00:00:00-0800".

Though it is tempting to use the mysql-like YYYY-MM-DD formatting, it's probably better to simply avoid it since it's not supported by old browsers (I tried on IE8 and IE7, it failed !), and tricky when it comes to new ones.

### Quick reminder
Here is a quick reminder of the different results I got (you may have other results depending on where you live) :

```javascript
/** UTC DATE Reference **/

new Date(Date.UTC(2012,0,1));
new Date('2012');
new Date('2012-01-01');
new Date('2012-01-01T00:00:00+0000');

//=> Mon Dec 31 2011 16:00:00 GMT-0800 (PST)


/** LOCAL DATE */

new Date(2012,0,1);
new Date('January 1, 2012');
new Date('2012/01/01');
new Date('2012-01-01T00:00:00-0800');

//=> Tue Jan 01 2012 00:00:00 GMT-0800 (PST)
```

*Please note:*
What is true for Date constructor is also true for **Date.parse** static method.

*Please note 2:*
Chrome interprets in local time the following code :

```javascript
new Date("2012-01-01 00:00:00");
```

So the simple fact to add a time makes you jump from GMT to local time.

Firefox doesn't understand this format and it's probably for the best.
