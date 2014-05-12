---
layout: post
title: "External Stylesheets and Web Performance"
date: 2012-06-24 17:18
comments: true
categories: 
---

In my previous article, I listed the [3 key moments and two major concepts I keep in mind when trying to improve web performance](/blog/2012/06/23/three-key-moments-web-performance/).
Let's see the impact of external stylesheets on each of them.

<!-- more -->

## Start Render Time && Progressive Rendering

External Stylesheets referenced in the head delay the start render time. Stylesheets have to be first fetched and parsed before the page starts rendering.

An external stylesheet requested from the body won't delay start render time and won't block progressive rendering in most browsers but may end up exhibiting a FOUC (**Flash of Unstyled Content**) once the stylesheet is done downloading and parsed. Redraw may also occur.

**IE browsers** are the exception and **block page rendering** until all external stylesheets, referenced in the head or body, are downloaded. Page rendering it is and should not be confused with CSS rendering : the DOM elements are not showing at all and the user stares at a blank white screen for a few seconds until the content appear suddenly.

*To avoid both IE blank white screen and FOUC phenomenon, all stylesheets should be move to the document HEAD, even if it delays the start render time.*

## DOMContentLoaded event

The DOMContentLoaded event is fired when the document is done parsing and synchronously loaded scripts are parsed and executed.

It seems like external stylesheets shouldn't interfere with the event being fired but as explained in this [very interesting article by molily](http://molily.de/weblog/domcontentloaded), they do under certain circumstances.

> DOMContentLoaded event doesn't wait for stylesheets to load provided that **no scripts are placed after the stylesheet reference** <link rel="stylesheet">.

This happens because **a script following a stylesheet won't be executed until the stylesheet is done downloading**, even if the script is downloaded meanwhile. Since the scripts have to be executed before the DOMContentLoaded event is fired, it delays the event.

Stylesheets block the execution of : | Webkit | Gecko | IE
---------------------------------    | ------ | ----- | --
subsequent external scripts          | yes    | yes   | yes
subsequent inline scripts            | no     | yes   | yes
previous scripts | no | no | no

*There is no really solution for this problem. The scripts should be at the bottom of the page, and stylesheets as lightweight as possible. When possible, scripts containing code only needed after page load should be loaded asynchronously.*

## Parallel Downloads

Stylesheets don't block parallel downloads of other components, except in those browsers :

* in Chrome if a stylesheet is followed by a script, other components are not downloaded until the stylesheet is fetched

* in IE7 & IE8 if there is :

    * an inline script later in the DOM
    * IE conditional comments

Stoyan Stefanov explains in [this article](http://www.phpied.com/conditional-comments-block-downloads/) how to fix the issue with conditional comments. Just add an empty cc just before the stylesheet reference.

```markup
<!--[if IE]><![endif]-->
<link rel="stylesheet" href="css/style.css" type="text/css" media="screen">
<!--[if IE 7]>
<link rel="stylesheet" href="css/ie7.css" type="text/css" media="screen">
<![endif]-->
```

## Document Complete

External Stylesheets have no direct impact on Document Complete Time. But the onload event will be likely to be subsequently delayed by the previous factors.
