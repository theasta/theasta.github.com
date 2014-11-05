title: Versioning JavaScript and CSS files while improving page load time and reducing bandwidth cost
date: 2014-11-04 20:10:23
tags:
---

> td;lr: The most efficient asset pipeline strategy both in terms of cost-cutting and performance-boosting is to version your files on an asset basis and not per release. The [grunt-assets-versioning plugin](https://github.com/theasta/grunt-assets-versioning) plugin will automatically handle the process for you and put up a map of version tags than you can easily integrate into your back-end stack.

<!-- more -->

## Why do we need to version static assets in the first place?

Static assets are the application's static resources like JavaScript files, CSS files, images, fonts...

When a user visits your homepage for the first time, she has to download all the images, css and js files used by this page. Then when she goes to your sign-in page, if the JavaScript file you are using on that page is identical, she shouldn't have to re-download it since it is present in the browser cache. This is the main tenet of web performance : **make fewer http requests**.

For static assets, this is achieved by setting up an expires header for each file:

```
Expires:Fri, 13 Oct 2034 05:00:00 GMT
```

The header above means that, as long as the file is in the cache, the browser won't make any request to the server for that specific file for the next 20 years.

Great but as a website evolves, the codebase also grows. Files will be added, removed, modified. Every time you roll out a release, you need to ensure your users will get their latest versions.

This is why you need to add to your assets a tag that will act like a cache buster. There are several ways to do so:

1. Query string parameter: /js/main.js__?v=1.2.0__
2. Folder: __/1.2.0__/js/main.js
3. File name: /js/main__.1.2.0__.js


## The most effective cache-busting technique is not the easiest to implement in the back-end

All the major frameworks offer a way to handle static assets. For example, Symfony2 uses the [Assetic bundle for asset management](http://symfony.com/doc/current/cookbook/assetic/asset_management.html) . The Play Framework provides an [Asset Controller](https://www.playframework.com/documentation/2.0/Assets).

By default, they handle versioning by appending a version hash (as a folder or a query string parameter) that matches the release version.

```
<script src="/{VERSION_TAG}/js/main.js"></script>
<img src="/{VERSION_TAG}/images/logo.png" alt="my logo">
```

The plus side of such an approach is that it is pretty straightforward to implement. The asset controller function only needs to know one version tag, that is also the release version tag, and is common to all resources at a point of time.

The downside is: Everytime you do a release, you need to upload all your static assets back to your CDN or host, **whether they have changed or not**. Subsequently your users have to re-download resources even if they are exactly the same.   
It will **cost you more money** and hurt your web performance.

The solution is to implement a per-asset strategy.

Let's see how Symfony2 lets you do it:

```
<script src="{{ asset('js/main.js', version='5.0')) } }"></script>
<img src="{{ asset('images/logo.png', version='3.0') } }" alt="my logo" />
```

That makes completely sense but since it's hardcoded, it means you need to update every single asset version manually. This is not maintainable and needs to be automated.

It is quite easy to write a wrapper around any asset controller out there and use a simple dictionary to look up for the current versioned path of the resource file you are targetting.

```
{
"js/main.js": "js/main.5.0.js",
"images/logo.png": "images/logo.3.0.png"
}
```

The missing piece now is to have the static assets deployment generate that version map for you.

## Introducing the grunt-assets-versioning plugin

Grunt is a JavaScript task runner. It is very popular and a lot of people are using to deploy your static assets. There are many open-source and well-tested plugins that will let you perform all the necessary steps: bundling, minifying, compressing, sending to a CDN...

The mandate of the grunt-assets-versioning plugin is not only to version your static assets but also to output a version tag mapping you can consume in your back-end assets controller.

There are many options, you can for example use a hash tag (recommended) or a date tag, choose the format or the length of the tag, etc...

```
assets_versioning: {
    deployment: {
        options: {
            versionsMapFile: 'assets.json'
        },
        files: { 
            'js/main.js': [ 'src/js/file1.js', 'src/js/file2.js'],
            'images/logo.png': ['src/images/logo.png']
        }
    }
}
```

The task will create two files:

* js/main.xxxxxxxxx.js
* images/logo.yyyyyyyy.png

and generate a json file with all the mapping information you will need:

```json
[
	{ "originalPath": "js/main.js", "versionedPath": "js/main.xxxxxxxxx.js", "version": "xxxxxxxxx" },
	{ "originalPath": "images/logo.png", "versionedPath": "images/logo.yyyyyyyy.png", "version": "yyyyyyyy" }
]
```

## How to customize the version map file

If the map format above doesn't suit your needs or if you prefer to create for example a php file containing an array of files so you don't have to request and parse the json file every single time you are using your asset controller wrapper, you can pass a template file to the grunt assets versioning so that it generates exactly the file you will be needing.

For example you can use this template:
```
<?php
class StaticAssets
{
  public static $dict = array(
<% _.forEach(files, function(file) { %>
    "<%= file.originalPath %>" => "<%= file.versionedPath %>",
<% }); %>
  );
}
```
and the grunt assets versioning plugin will generate this file:

```php
<?php
class StaticAssets
{
  public static $dict = array(
    "js/main.js" => "js/main.xxxxxxxxx.js",
    "images/logo.png" => "images/logo.yyyyyyyy.png",
  );
}
```

In order to do this, you will need to pass the path to the template using the versionsMapTemplate

```
assets_versioning: {
	deployment: {
		options: {
			versionsMapFile: 'assets.php',
			versionsMapTemplate: 'assets.php.tpl'
		},
		files: { 
			'js/main.js': [ 'src/js/file1.js', 'src/js/file2.js'],
			'images/logo.png': ['src/images/logo.png']
		}
	}
}
```

Whatever programming language you are using, you can easily output a version tag dictionary that will meet your requirements and can be consumed by your backend controllers to retrieve the versioned path to your static assets.