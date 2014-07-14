title: 'A NodeJS, MongoDB and Redis dev environment with Vagrant and Ansible'
date: 2014-07-13 16:59:13
tags:
---

When I want to give a crack at a new library or try out an idea, I almost always use the same tech stack for the backend: Nginx to serve static assets, NodeJS to create an api, MongoDB to store data, and finally Redis to manage sessions.

Since I want to be able to port my dev environment easily, I use a tailor-made virtual machine that I can boot from anywhere as long as I have the following installed:
<!-- more -->

* [Virtual Box](https://www.virtualbox.org/) - version 4.3.8 [<sup>[1]</sup>](#footnotes)
* [Vagrant](http://www.vagrantup.com/) - version 1.5.0  [<sup>[1]</sup>](#footnotes)
* [Ansible](http://docs.ansible.com/intro_installation.html) - version 1.5.2  [<sup>[1]</sup>](#footnotes)

If you want to use this virtual machine, follow the next steps:

```
git clone https://github.com/theasta/vagrant-nodejs-dev.git
cd vagrant-nodejs-dev
vagrant up
```

You now have an Ubuntu machine running with nginx, mongodb, nodejs and redis pre-installed.

## Getting your nodejs app to run on the virtual machine

The ansible-nodejs-apps playbook included in the repo will hugely simplify the process.

To boot an app, the playbook relies on the package.json file that should be located at the root of any nodejs server-side app worthy of the name.   
If ever you are not using server.js as your primary file, you should also update the "script" object with the proper information.

```
"scripts": {"start": "node myApp.js"}
```

Then, there are two different ways to fire your app.

### Put your source code alongside the Vagrantfile and ansible-playbooks

This is the easiest way: if you have your app at the root of the repo, you have nothing to do than to have, it will get automatically booted.

If your app is listening to port 3000, you can access it at "http://192.168.50.3:3000"[<sup>[2]</sup>](#footnotes)

###  Symlink your applications

You can create a vagrant sync folder that links to your local working directory.  This way, any changes you make locally is also on the vm right away.

This configuration has the tremendous advantage of letting you have multiple apps running on a single virtual machine (as long as they are using different ports).

Add this line in the Vagrantfile:

```
  config.vm.synced_folder "/local/path/to/myapp", "/srv/myapp"
  config.vm.synced_folder "/local/path/to/anotherapp", "/srv/anotherapp"
```

Now you need to list the apps you want to enable by listing them in ansible-playbooks/main.yml:

``` 
  - role: ansible-nodejs-apps
    apps:
      enabled:
        - "/srv/myapp/"
        - "/srv/anotherapp/"
```

Then `vagrant reload --provision` and you're all good.

## Docker?

I would be curious to know if a docker image based on this vagrant configuration would make it even more straightforward. I would be stoked to hear from you if you have any insights on that matter.


<a name="footnotes"></a>

* <sup>[1]</sup> It may also work with newer versions.   
* <sup>[2]</sup> The network ip is defined in Vagrantfile, you can modify if necessary.

