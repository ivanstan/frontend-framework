##Philosophy

Application resources "pages" are called states and are composed of view and controller. States are further grouped into
modules.
Each module defines its own routing of states and can also override routing provided by other modules.

## Application Lifecycle

Once application is bootstraped all modules will be created and their constructors will be called.
This is one time event that occurs when user has accessed the application for the first time.

<div class="mermaid">
graph LR;
    AL(Application Loaded)-->MC(Module constructors);
</div>

Afterwards all state changes are preformed via asynchronous calls according to the application lifecycle and no page refresh will be executed.

<div class="mermaid">
graph LR;
    ConDestructor(Controller destructor)-->ModPreRender(Module preRender)
    ModPreRender-->ConConstructor(Controller Constructor)
    ConConstructor-->ConPostRender(Controller preRender)
    ConPostRender-->ConPreRender(Controller postRender)
    ConPreRender-->ModPostRender(Module postRender)
</div>

##Project structure
<table class="table">
    <tbody>
        <tr>
            <td width="220px"><i class="fa fa-folder-open-o" aria-hidden="true"></i> assets</td>
            <td>Assets folder should contain images, fonts and built versions of javascripts and stylesheets files will be stored here
            </td>
        </tr>
        <tr>
            <td width="220px"><i class="fa fa-file-text-o" aria-hidden="true" style="padding-left: 20px;"></i> index.html</td>
            <td>Template into which assets will be injected and later used for building <span class="file">index.html</span> and <span class="file">index-dev.html</span> files in the root of project</td>
        </tr>
        <tr>
            <td width="220px"><i class="fa fa-file-code-o" aria-hidden="true" style="padding-left: 20px;"></i> javascript.js</td>
            <td>Minimized version of javascript build from <code>libs</code> section of <span class="file">bootstrap.json</span></td>
        </tr>
        <tr>
            <td width="220px"><i class="fa fa-file-text-o" aria-hidden="true" style="padding-left: 20px;"></i> styles.css</td>
            <td>Minimized version of stylesheets built from <span class="file">sass</span> files thought project</td>
        </tr>
        <tr>
            <td><i class="fa fa-folder-o" aria-hidden="true"></i> build</td>
            <td>Framework will be built here into single file</td>
        </tr>
        <tr>
            <td><i class="fa fa-folder-o" aria-hidden="true"></i> core</td>
            <td>Core of the framework, not intended to be modified by end developer</td>
        </tr>
        <tr>
            <td><i class="fa fa-folder-open-o" aria-hidden="true"></i> module</td>
            <td>This is where all your code should go, organized in modules</td>
        </tr>
        <tr>
            <td width="220px"><i class="fa fa-folder-open-o" aria-hidden="true" style="padding-left: 20px;"></i> example</td>
            <td>Example module</td>
        </tr>
        <tr>
            <td width="220px"><i class="fa fa-folder-open-o" aria-hidden="true" style="padding-left: 40px;"></i> controller</td>
            <td>Module controllers</td>
        </tr>
        <tr>
            <td width="220px"><i class="fa fa-file-code-o" aria-hidden="true" style="padding-left: 60px;"></i> FooController.js</td>
            <td>State controller</td>
        </tr>
        <tr>
            <td width="220px"><i class="fa fa-folder-open-o" aria-hidden="true" style="padding-left: 40px;"></i> view</td>
            <td>Module views</td>
        </tr>
        <tr>
            <td width="220px"><i class="fa fa-file-text-o" aria-hidden="true" style="padding-left: 60px;"></i> fooView.html</td>
            <td>State view</td>
        </tr>
        <tr>
            <td width="220px"><i class="fa fa-file-code-o" aria-hidden="true" style="padding-left: 40px;"></i> ExampleModule.js</td>
            <td>Module class</td>
        </tr>
        <tr>
            <td><i class="fa fa-folder-o" aria-hidden="true"></i> tests</td>
            <td>Framework tests, running on Karma and Jasmine.</td>
        </tr>
        <tr>
            <td><i class="fa fa-folder-o" aria-hidden="true"></i> vendor</td>
            <td>Place where 3rd party dependencies should hang out, unless they are somewhere on cdn</td>
        </tr>
        <tr>
            <td width="220px"><i class="fa fa-file-text-o" aria-hidden="true"></i> index.html</td>
            <td>Production version of application. Debugging off. Using minimized versions of resources</td>
        </tr>
        <tr>
            <td width="220px"><i class="fa fa-file-text-o" aria-hidden="true"></i> index-dev.html</td>
            <td>Development version of application. Debugging on. Using full versions of resources</td>
        </tr>
        <tr>
            <td width="220px"><i class="fa fa-file-code-o" aria-hidden="true"></i> bootstrap.json</td>
            <td>Configuration file</td>
        </tr>
    </tbody>
</table>


##Configuration

Application is intended to be configured in <span class="file">bootstrap.json</span> file. Bellow is the overview of configuration object:

<table class="table">
    <tbody>
    <tr>
        <td><code>modules</code></td>
        <td width="220px"></td>
        <td>
            Object of modules that exist in application. This names should match the folder names in module
            folder.
        </td>
    </tr>
    <tr>
        <td><code>viewSelector</code></td>
        <td><code>'#container'</code></td>
        <td>
            jQuery selector of the html element in which state should be loaded. This element should exist inside
            assets/index.html file.
        </td>
    </tr>
    <tr>
        <td><code>libs</code></td>
        <td></td>
        <td>
            Object containing libraries. Mappings of the JavaScript and scss files, which are to be used in build process.
        </td>
    </tr>
    </tbody>
</table>

Here is an example:
```javascript

    {
      "modules": {
        "example": {                                        // example of module deffinition
          "settings": {}                                    // here we can define custom module settings
        },
        "anotherModule": {}
      },
      "viewSelector": "#container",
      "libs": [                                             // libraries stored localy in vendor folder should be mapped here
        {
          "name": "framework",                              // framework is deffined as application dependency
          "js": ["build/frontend-framework-1.0.0.js"]
        },
        {
          "name": "application",
          "dependencies": ["framework"],                    // framework will be included before this library
          "scss": ["module/example/styles.scss"],
          "js": ["bootstrap.js"]
        }
      ]
    }

```

##Creating module
User's modules reside inside the <span class="folder">module</span> folder and are organized module per folder.

After creating module directory. It should be added into modules object of in <span class="file">bootstrap.json</span> file.
This way framework will know about existence of new module.

The main JavaScript of module file should reside inside the module directory and be called same as module
with <span class="text-muted">.js</span> extension.

```javascript

    class ExampleModule extends Module {

        constructor() {
            this.settings = {};     // define custom module settings here
            this.routes = {         // define routes, in this example for url www.example.com/index.html#example/foo
                "example/foo": {    // application will execute state called foo inside example module. For such state
                    state: 'foo'    // view fooView.html will be displayed and its controller FooController.js will be
                }                   // executed.
            };
        }

        preRender(defer) {
            return super.preRender(defer);
        }

        postRender(defer) {
            $("[data-toggle='tooltip']").tooltip();
            $("[data-toggle='popover']").popover();

            return super.postRender(defer);
        }
    }

    window.classes["ExampleModule"] = ExampleModule;

```

Module can implement method <code>postRender()</code> which is called once state rendering is complete.
Handy place to
initiate global jQuery components. Also module property settings will be packed with other module's settings
into single object available trough application, particularly in controllers via <code>this.settings</code>

##Creating state

Application states are created inside the module. Each state is conceptually similar to page in conventional
web applications. States are consisted out of controller and view and architecture is based on MVC pattern.
When creating a state first is to declare state view inside <span class="folder">view</span> folder. Views
are always named by state name according to the url and suffixed named like the following <span class="file">fooView.html</span>.
Here is example of such file:

```html

    <!-- This is example of our example/view/fooView.html -->

    <!-- Line bellow will include our foo state controller located in example module (example/controller/FooController.js) -->
    <script src="../controller/FooController.js"></script>

    <template>
          <!-- Here should go contents of our state which will be inserted in element defined in viewSelector -->
    </template>

```

<p>
After state view is defined our next job is to determine its behavior, for that we use state contollers. Let's analyze
the contents of one such file: <span class="file">example/controller/FooController.js</span>.
</p>

```javascript

class FooController extends Controller {

    constructor(app) {
        super(app);

    }

    /**
     * PreRender hook is used to perform task before state is rendered to application. Code bellow shows
     * some of the common tasks that can be performed here.
     */
    preRender(defer) {

        $.ajax({                            // here we are fetching some data via ajax.
            url: 'example.com/async',
            success: (data) => {
                this.data = data;           // assigning the data fetched to state controller property.
                defer.resolve();            // resolve (or reject) defer object so we can continue
                                            // rendering process after async code is finished.
            }
        });
        
        let template = this.template;            // at this point template is already fetched and it could be processed
        this.template = template.toUpperCase();  // here we will make all letters in template look like someone is shouting. 
                                                 // Alternative is to override template getter which is shown in method
                                                 // bellow.
        return defer.promise(); // every hook returns promise
    }

    /**
     * After async is executed and promise resolved, template getter is being called. We can override it in our
     * controller class to make modification to template html, for example replace placeholders with Handlebars.js
     */
    get template() {
        return super.template;
    }

    /**
     * Called after html has been rendered on page. Attach event handlers here.
     */
    postRender(defer) {
        return super.postRender(defer); // parent method will resolve defered object.
    }

    /**
     * Called before navigating to next state. Clear mess your state has made here.
     */
    destructor(defer) {
        return super.destructor(defer); // parent method will resolve defered object.
    }

}

window.classes['FooController'] = FooController;

```

Now our state is ready and we can finally access it via its appropriate url:
<span class="url">https://example.com/application/#example/foo</span>
