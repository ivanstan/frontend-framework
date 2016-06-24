<!---->
<!--# Global-->
<!---->





* * *

## Class: Framework



## Class: Framework
Application bootstrap.

### Framework.loadModules() 

Performs loading of modules.

**Returns**: `*`

### Framework.navigate(route) 

Navigate to state.

**Parameters**

**route**: `Route`, Navigate to state.


### Framework.hook(hookName) 

Execute a module hook. This function will run methods name hookName in all modules.

**Parameters**

**hookName**: `String`, Execute a module hook. This function will run methods name hookName in all modules.


### Framework.notification(type, title, message) 

Raise notification to user.

**Parameters**

**type**: `String`, Possible values: 'error', 'warning', 'success', 'info'

**title**: `String`, Raise notification to user.

**message**: `String`, Raise notification to user.


### Framework.isDebug() 

Returns true if application is in debug mode.

**Returns**: `Boolean`



* * *










