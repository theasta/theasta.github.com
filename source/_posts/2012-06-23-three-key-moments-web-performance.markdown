---
layout: post
title: "Three Key Moments to keep in mind when dealing with page load performance"
date: 2012-06-23 18:36
comments: true
categories: 
---

Web performance is not about how fast a web page loads but about how fast it gives the impression to the user to load and how long it takes for the page to actually be ready for interaction.
It's a mix of perceptiveness and pure metrics.

Here's the three key moments and two crucial concepts I keep in mind when trying to improve load performance.

<!-- more -->

## Key Moments

### Start Render Time
The start render time is the moment the **page stops being blank** and the user can actually see something in her browser: some text, a background-color ...

*The start render time is displayed in WebPageTest as a vertical colored bar (the first one). Firebug & Chrome Developer Tools don't display it.*

### DOMContentLoaded event
The DOMContentLoaded event is fired when the document is done parsing and synchronous scripts are loaded, parsed and executed.

This event is better known to developers as the **jquery $.ready function**.
It is supported by Chrome, Firefox, IE9+ and has been added to the HTML5 Specification. For older versions of IE, it's possible to fallback to use the onreadystatechange event.

This event is highly important since it is used to bind other events and run initialization code. One can consider that at this moment, the page's dom elements are ready for interaction.

<!--The DOMContentLoaded event can happen before or after the start render time.-->

*Firebug & Chrome Developer Tools both display this event as a vertical colored bar (the first one). WebPageTest displays it as a pink column when accurate.*

### Document Complete / onload event

By the time the DOMContentLoaded event is fired, the page's DOM is parsed and ready. Referenced elements like images or iframes may not be done loading though. Once they are retrieved, the browser considers the page fully loaded. The 'onload' event is fired.

Document Complete is actually the point in time when **all the content referenced in the HTML is fully-loaded**.

*This event can be seen in Firebug or Chrome Developer Tools' timeline...*

!["Chrome Developer Tools Waterfall"][screenshot_chrome_waterfall]

*or in WebPageTest :*

!["WebPageTest Waterfall"][screenshot_webpagetest_waterfall]

## Two important notions

### Progressive Rendering

Between the Start Render Time and the Document Complete Time (and even beyond since there is no such thing as a stop render time), the web page is rendered progressively. Elements appear as soon as they are downloaded and available.
It works as a progress indicator and can influence on how fast the user feels the page is loading.

*Webpagetest.org allows you to generate a video that allows to see how the webpage renders.*


### Parallel downloads

It is the ability to download multiple components simultaneously from the same hostname.
It has a big impact on both Progressive Rendering and Document Complete time.

The number of components that can be loaded simultaneously depends on the web browser. For example, IE6 & IE7 limit parallel downloads to 2 per hostname, IE8 to 6.


[screenshot_chrome_waterfall]: /images/2012-06/chrome-waterfall.gif
[screenshot_webpagetest_waterfall]: /images/2012-06/webpagetest-waterfall.gif
