<!---->
<!--# Global-->
<!---->





* * *

## Class: Controller



## Class: Controller


**deferred**:  , Defer object getter. Getter of deferred object of async method.
**template**:  , Template getter.
**template**:  
**route**:  
**route**:  
### Controller.preRender() 

Override this method in your controller to process asynchronous requests.
Further controller processing shall not be executed until defer object is either
resolver or rejected.

**Returns**: `Promise`, promise

### Controller.postRender() 

Template is loaded. Use this method to attach event handlers.


### Controller.destructor() 

Called when controller another controller is called. Event handlers will be detached automatically,
use this method to cleanup additional elements added on page.




* * *










