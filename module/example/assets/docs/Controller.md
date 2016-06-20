<!---->
<!--# Global-->
<!---->





* * *

## Class: Controller



## Class: Controller


### Controller.async() 

Override this method in your controller to process asynchronous requests.
Further controller processing shall not be executed until defer object is either
resolver or rejected.

**Returns**: , Defer promise

### Controller.assign() 

Template is loaded. Use this method to attach event handlers.


### Controller.resign() 

Called when controller another controller is called. Event handlers will be detached automatically,
use this method to cleanup additional elements added on page.




* * *










