1. Use a different image for the background.  
```js
background.src = 'images/background.png';
```
2. Draw the runner at different locations in the canvas. 
```js  
context.drawImage(runnerImage, 400, 340);
```
3. Draw the background at different locations in the canvas.  
```js
context.drawImage(background, 20, 50);
``` 
4. In the draw() function, draw the runner first and then the background.
```js
function draw() {
    drawRunner();
    drawBackground();
}
```    
5. Remove the width and height attributes from the snailbait-game-canvas element in index.html and add width and height properties—with the same values of 800px and 400px, respectively—to the snailbait-game-canvas element in the CSS file. When you restart the game, does it look the same as before? Can you explain the result?  
```css
#snailbait-game-canvas{
    border: 1.5px solid blue;
    width: 800px;
    height: 400px;
}
``` 