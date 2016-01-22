layout: post
title: "There Is A Life Outside The IDE For Your JSDoc Comments"
date: 2016-01-22 07:48:27
tags:
---

Applications that I really use on a daily basis can be counted on the fingers of one hand, one of them is an API Documentation Browser called [Dash](https://kapeli.com/dash). Used in conjunction with [Alfred](https://www.alfredapp.com/), it lets you access and search docs in a heartbeat, even if you're offline.  
Wouldn't that be **great if you could also use it with your own projects**? You actually can!
<!-- more -->

![Searching Dash for "FileL" through Alfred][alfred_screenshot]

Here's how to automatically generate a dash-compatible docset from your own code and JSDoc comments.

```bash
npm install jsdoc -g
npm install jsdoc-dash-template --save-dev
jsdoc -d path/to/output/folder -p -t node_modules/jsdoc-dash-template -r path/to/src/folder
```

Double-click on the docset to open it in Dash. Linux or Windows users may also take a shot at [Zeal](https://zealdocs.org/) or [Velocity](https://velocity.silverlakesoftware.com/).

![Searching Dash for "ReactReconciler"][dash_screenshot]

If you're just curious about the final result, you can download the [docset I created by running the tool directly on React source code][docset_link]. The generated documentation won't look like the public API you can find on the official website since it also exposes the private methods. Very handy if you want to dive into React internals.

The original project, [jsdoc-dash-template](https://github.com/theasta/jsdoc-dash-template), is hosted on Github. The README file provides further documentation on how to fine-tune your docset by adding a custom icon or title. Feel free to log any issues you may encounter directly there.


[alfred_screenshot]: /images/2016/jsdoc-docset-alfred.jpeg
[dash_screenshot]: /images/2016/jsdoc-docset-dash.jpeg
[docset_link]: https://www.dropbox.com/s/aqhw0a69dyccmh5/reactDev.docset.zip?dl=0
