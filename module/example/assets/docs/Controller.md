<!---->
<!--# Global-->
<!---->





* * *

## Class: Controller



## Class: Controller


**template**:  , Template getter.
**template**:  
### Controller.preRender() 

Override this method in your controller to process asynchronous requests.Further controller processing shall not be executed until defer object is eitherresolver or rejected.

**Returns**: `Promise`, promise

### Controller.postRender(defer) 

Template is loaded. Use this method to attach event handlers.

**Parameters**

**defer**: , Template is loaded. Use this method to attach event handlers.

**Returns**: `Promise`

### Controller.destructor(defer) 

Called when controller another controller is called. Event handlers will be detached automatically,use this method to cleanup additional elements added on page.

**Parameters**

**defer**: , Called when controller another controller is called. Event handlers will be detached automatically,use this method to cleanup additional elements added on page.

**Returns**: `Promise`



* * *










