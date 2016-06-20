##Routing

Application resources are organized in states which are routed in scheme <span class="url">#module-name/state-name</span>
Here is an example url which will navigate to state bar inside foo module:
<span class="url">https://example.com/application/#foo/bar</span>

##Directory structure
<table class="table">
    <tbody>
    <tr>
        <td width="160px"><i class="fa fa-folder-open" aria-hidden="true"></i> assets</td>
        <td>Assets folder should contain images, fonts, and everything else that is not JavaScript or
            stylesheet.
            Built versions of JavaScripts and sass files will be stored here. Assets folder also holds
            index.html which
            is template into which assets will be injected and later used for building index.html and
            index-dev.html files
            in the root of project.
        </td>
    </tr>
    <tr>
        <td><i class="fa fa-folder-open" aria-hidden="true"></i> build</td>
        <td>Framework will be built here into single file.</td>
    </tr>
    <tr>
        <td><i class="fa fa-folder-open" aria-hidden="true"></i> core</td>
        <td>Core of the framework, not intended to be modified by end developer.</td>
    </tr>
    <tr>
        <td><i class="fa fa-folder-open" aria-hidden="true"></i> module</td>
        <td>This is where all your code should go, organized in modules</td>
    </tr>
    <tr>
        <td><i class="fa fa-folder-open" aria-hidden="true"></i> tests</td>
        <td>Framework tests, running on Karma and Jasmine.</td>
    </tr>
    <tr>
        <td><i class="fa fa-folder-open" aria-hidden="true"></i> vendor</td>
        <td>Place where 3rd party dependencies should hang out, unless they are somewhere on cdn.</td>
    </tr>
    </tbody>
</table>

##Configuration

Application is intended to be configured in bootstrap.json file. Bellow is the overview of configuration object:

<table class="table">
    <tbody>
    <tr>
        <td><code>modules</code></td>
        <td width="160px"><code>{'foo': {}, 'test': {}}</code></td>
        <td>Object of modules that exist in application. This names should match the folder names in module
            folder.
        </td>
    </tr>
    <tr>
        <td><code>viewSelector</code></td>
        <td><code>'#container'</code></td>
        <td>jQuery selector of the html element in which state should be loaded. This element should exist
            inside assets/index.html file.
        </td>
    </tr>
    <tr>
        <td><code>default</code></td>
        <td></td>
        <td>Object defining default module and state (to use when these are not provided in url).</td>
    </tr>
    <tr>
        <td><code>libs</code></td>
        <td></td>
        <td>Object containing libraries. Mappings of the JavaScript and scss files, which are to be used in
            build process.
        </td>
    </tr>
    </tbody>
</table>

##Creating module
User's modules reside inside the <span class="folder">module</span> folder and are organized module per folder.


After creating module directory. It should be added into modules object of in bootstrap.json file.
This way framework will know about existence of new module.

The main JavaScript of module file should reside inside the module directory and be called same as module
with <span class="text-muted">.js</span> extension.


```javascript
    class ExampleModule extends Module {

        constructor() {
            this.settings = {};
        }

        postRender() {
            $("[data-toggle='tooltip']").tooltip();
            $("[data-toggle='popover']").popover();
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
are always named by state name according to the url and suffixed with <span class="file">.html</span>
extension.
Here is example of bar.html, lines are explained as in-code comments.

```html
    <!-- This is example of our foo/view/bar.html -->

    <!-- Line bellow will include our bar state controller located in foo module (foo/controller/BarController.js) -->
    <script src="../controller/BarController.js"></script>

    <template>
          <!-- Here should go contents of our state which will be inserted in element defined in viewSelector -->
    </template>
```

<p>Let's analyze the contents of <span class="file">BarController.js</span> which will control the behavior of the state.</p>

```javascript
class BarController extends Controller {

    constructor() {
        super();

        // our module settings are available here :)
        this.settings = {};
    }

    /**
     * Sometimes we need to do something asynchronous in our state such as ajax call. This is the place for it.
     * Until defer object is either resolved or rejected no further rendering of html will happen.
     */
    async(defer) {

        if(somethingAsync(function(data) {
            this.someData = data;
            defer.resolve();
        }));

        return defer.promise();
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
    assign() {

    }

    /**
     * Called before navigating to next state. Clear mess your state has made here.
     */
    resign() {

    }

}

window.classes['BarController'] = BarController;
```

Now our state is ready and we can finally access it via its appropriate url: <span class="url">https://example.com/application/#foo/bar</span>

