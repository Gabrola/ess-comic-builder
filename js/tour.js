guiders.createGuider({
  buttons: [{name: "Next"}],
  description: "The quick tour should help you be familiar with the basic functions of the ESS Comic Builder",
  id: "1",
  next: "2",
  overlay: true,
  title: "ESS Comic Builder Tour!"
});

guiders.createGuider({
  attachTo: ".memeList",
  buttons: [{name: "Close"}],
  description: "First off, we'll show you how to add memes to your comic. Go ahead choose a meme category!",
  id: "2",
  next: "3",
  position: 3,
  title: "Adding a Meme to Comic"
});

guiders.createGuider({
  attachTo: ".canvasArea",
  buttons: [{name: "Close"}],
  description: "Now go ahead and drag a meme to your canvas.",
  id: "3",
  next: "4",
  position: 3,
  title: "Adding a Meme to Comic"
});

guiders.createGuider({
  attachTo: "#btnDraw",
  buttons: [{name: "Close"}],
  description: "Good job! Now we'll show you how to draw freely onto the canvas. Now choose the 'Freehand Drawing' tool.",
  id: "4",
  next: "5",
  position: 6,
  title: "Drawing"
});

guiders.createGuider({
  attachTo: ".freeHand",
  buttons: [{name: "Close"}],
  description: "Now draw anything onto your canvas, you can also set your pencil thickness and color here.",
  id: "5",
  next: "6",
  position: 9,
  title: "Drawing"
});

guiders.createGuider({
  attachTo: "#btnRotation",
  buttons: [{name: "Next"},{name: "Close"}],
  description: "Good job! This button will disable object rotation so you don't accidentally rotate objects while resizing them.",
  id: "6",
  next: "7",
  position: 6,
  title: "Disable Object Rotation"
});

guiders.createGuider({
  attachTo: "#btnText",
  buttons: [{name: "Close"}],
  description: "Click this button to add text to your canvas.",
  id: "7",
  next: "8",
  position: 6,
  title: "Text Tool"
});

guiders.createGuider({
  attachTo: ".textString",
  buttons: [{name: "Close"}],
  description: "Enter text here to be added to your canvas and set any text styling options you may want, then press 'Add' below.",
  id: "8",
  next: "9",
  position: 9,
  title: "Text Tool"
});