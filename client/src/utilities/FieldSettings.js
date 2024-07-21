// import $ from "jquery";
// var Width = "#field".width();
// var width = ($("#field").width() * 8) / 9.5;
// var height = $("#field").height();
// var offset = $("#field").offset();
// var stage = new Konva.Stage({
//   container: "container",
//   width: Width,
//   height: height,
// });
// var layer = new Konva.Layer();

// // setting ground
// var ellipse = new Konva.Ellipse({
//   radius: { x: width / 2, y: height / 2 },
//   x: width / 2,
//   y: height / 2,
//   fill: "#4CB050",
//   stroke: "black",
//   strokeWidth: 0,
// });
// var ellipse2 = new Konva.Ellipse({
//   radius: { x: (width * 0.95) / 2, y: (height * 0.95) / 2 },
//   x: width / 2,
//   y: height / 2,
//   fill: "#0D8F4F",
//   stroke: "white",
//   strokeWidth: 4,
// });

// var ellipse3 = new Konva.Ellipse({
//   radius: { x: (width * 0.55) / 2, y: (height * 0.55) / 2 },
//   x: width / 2,
//   y: height / 2,
//   fill: "#0A8043",
//   stroke: "white",
//   strokeWidth: 4,
// });

// // BAT
// var batwidth = 0.006;
// var batheight = 0.02;

// var batshaft = new Konva.Rect({
//   x: 0,
//   y: 0,
//   width: width * batwidth,
//   height: height * batheight,
//   fill: "#C8B9A4",
//   stroke: "grey",
//   cornerRadius: 1,
//   strokeWidth: 0.5,
// });

// var batgrip = new Konva.Rect({
//   x: (width * batwidth) / 2 - (width * batwidth) / 6,
//   y: (-height * batheight) / 2,
//   width: (width * batwidth) / 3,
//   height: (height * batheight) / 2,
//   fill: "black",
//   stroke: "white",
//   strokeWidth: 0.001,
// });

// var bat = new Konva.Group({
//   x: width / 2,
//   y: height / 2,
// });
// bat.add(batshaft);
// bat.add(batgrip);
// bat.rotate(30);
// // Add the rectangle to the layer

// var pitchx = 0.07;
// var pitchy = 0.18;
// var creasex = 0.035;
// var creasey = 0.02;

// bat.y(height / 2 - height * (pitchy / 2 - 0.01));
// bat.x(width / 2 - width * 0.005);

// var rectangle = new Konva.Rect({
//   width: width * pitchx,
//   height: height * pitchy,
//   x: width / 2 - (width * pitchx) / 2,
//   y: height / 2 - (height * pitchy) / 2,
//   fill: "#E2B07E",
//   stroke: "#E2D1A7",
// });

// var cr1 = new Konva.Line({
//   points: [
//     width / 2 - width * (pitchx / 2 + creasex),
//     height / 2 - height * (pitchy / 2 - creasey),
//     width / 2 + width * (pitchx / 2 + creasex),
//     height / 2 - height * (pitchy / 2 - creasey),
//   ],
//   stroke: "white",
//   strokeWidth: "2",
// });

// var cr2 = new Konva.Line({
//   points: [
//     width / 2 - width * (pitchx / 2 + creasex),
//     height / 2 + height * (pitchy / 2 - creasey),
//     width / 2 + width * (pitchx / 2 + creasex),
//     height / 2 + height * (pitchy / 2 - creasey),
//   ],
//   stroke: "white",
//   strokeWidth: "2",
// });

// layer.add(ellipse);
// layer.add(ellipse2);
// layer.add(ellipse3);
// layer.add(rectangle);
// layer.add(cr1);
// layer.add(cr2);
// layer.add(bat);
// stage.add(layer);

// var pad = 20;

// // bound below y=50
// var getPlayerGroup = function (pageX, pageY) {
//   return new Konva.Group({
//     x: pageX,
//     y: pageY,
//     draggable: true,
//     dragBoundFunc: function (pos) {
//       if (pos.x > width - pad && pos.y > height - pad) {
//         return { x: width - pad, y: height - pad };
//       }
//       if (pos.x > width - pad && pos.y < 0 + pad) {
//         return { x: width - pad, y: pad };
//       }
//       if (pos.x < 0 + pad && pos.y < 0 + pad) {
//         return { x: pad, y: pad };
//       }
//       if (pos.x < 0 + pad && pos.y > height - pad) {
//         return { x: pad, y: height - pad };
//       } else if (pos.x < 0 + pad) {
//         return { x: pad, y: pos.y };
//       } else if (pos.x > width - pad) {
//         return { x: width - pad, y: pos.y };
//       } else if (pos.y < 0 + pad) {
//         return { x: pos.x, y: pad };
//       } else if (pos.y > height - pad) {
//         return { x: pos.x, y: height - pad };
//       }

//       var ry = height / 2;
//       var rx = width / 2;
//       var disy = pos.y - ry;
//       var disx = pos.x - rx;
//       if ((disx * disx) / (rx * rx) + (disy * disy) / (ry * ry) < 0.95) {
//         return { x: pos.x, y: pos.y };
//       } else {
//         x = disx / rx;
//         y = disy / ry;
//         r = Math.sqrt(x * x + y * y);
//         disx = (x * rx * 0.95) / r + rx;
//         disy = (y * ry * 0.95) / r + ry;
//         return { x: disx, y: disy };
//       }
//     },
//   });
// };

// var getTextNode = function (stageBox, number) {
//   var textNode = new Konva.Text({
//     fontSize: 14,
//     fontFamily: "Ariel",
//     text: "Player" + number,
//     id: number.toString(),
//     fontStyle: "bold",
//     fill: "black",
//     padding: 10,
//     x: -40,
//     y: 5,
//   });

//   return textNode;
// };

// var getPosNode = function (stageBox, pos, id) {
//   var textNode = new Konva.Text({
//     fontSize: 12,
//     fontFamily: "Calibri",
//     text: pos,
//     id: id,
//     fill: "black",
//     padding: 10,
//     x: 8,
//     y: -15,
//   });

//   return textNode;
// };

// var getBowler = function (bname) {
//   var textNode = new Konva.Text({
//     fontSize: 25,
//     fontFamily: "Arial",
//     fontStyle: "bold",
//     text: bname,
//     id: "bowlername",
//     fill: "black",
//     padding: 10,
//     x: width / 2 - 100,
//     y: -10,
//     width: 200,
//     align: "center",
//   });

//   return textNode;
// };

// var getBatter = function (bname) {
//   var textNode = new Konva.Text({
//     fontSize: 25,
//     fontFamily: "Arial",
//     fontStyle: "bold",
//     text: bname,
//     id: "battername",
//     fill: "black",
//     padding: 0,
//     x: 0,
//     y: height - 25,
//     width: width,
//     align: "center",
//   });

//   return textNode;
// };

// var getBluePlayer = function () {
//   return new Konva.Circle({
//     radius: 10,
//     fill: "blue",
//     stroke: "black",
//     strokeWidth: 4,
//   });
// };
// var getYellowPlayer = function () {
//   return new Konva.Circle({
//     radius: 10,
//     x: 5,
//     y: 5,
//     fill: "yellow",
//     stroke: "black",
//     strokeWidth: 4,
//   });
// };

// var getRedPlayer = function () {
//   return new Konva.Circle({
//     radius: 10,
//     x: 5,
//     y: 5,
//     fill: "red",
//     stroke: "black",
//     strokeWidth: 4,
//   });
// };

// var positions = [
//   [0.49, 0.347],
//   [0.47, 0.68],
//   [0.466, 0.333],
//   [0.25, 0.15],
//   [0.3, 0.41],
//   [0.35, 0.53],
//   [0.32, 0.65],
//   [0.6, 0.74],
//   [0.7, 0.6],
//   [0.71, 0.41],
//   [0.6, 0.07],
// ];

// var allpos = [
//   "1st slip",
//   "2nd slip",
//   "3rd slip",
//   "4th slip",
//   "5th slip",
//   "6th slip",
//   "fly slip",
//   "gully",
//   "backward point",
//   "point",
//   "silly point",
//   "forward point",
//   "cover point",
//   "cover",
//   "short cover",
//   "extra cover",
//   "mid-off",
//   "deep mid-off",
//   "short mid-off",
//   "silly mid-off",
//   "mid-on",
//   "deep mid-on",
//   "short mid-on",
//   "silly mid-on",
//   "short mid-wicket",
//   "mid-wicket",
//   "short leg",
//   "square leg",
//   "forward square leg",
//   "backward square leg",
//   "leg slip",
//   "leg gully",
//   "backward short leg",
//   "fine leg",
//   "short fine leg",
//   "deep fine leg",
//   "long leg",
//   "square fine leg",
//   "straight fine leg",
//   "long stop",
//   "third man",
//   "short third man",
//   "deep third man",
//   "fine third man",
//   "square third man",
//   "deep backward point",
//   "deep point",
//   "deep cover point",
//   "deep cover",
//   "sweeper cover",
//   "wide long off",
//   "long off",
//   "straight long off",
//   "straight hit",
//   "straight long on",
//   "long on",
//   "wide long on",
//   "deep forward mid-wicket",
//   "deep mid-wicket",
//   "deep forward square leg",
//   "deep square leg",
//   "deep backward square leg",
// ];
// var allposcoord = [
//   [0.476, 0.98 - 0.633],
//   [0.461, 0.98 - 0.63],
//   [0.443, 0.98 - 0.615],
//   [0.426, 0.98 - 0.606],
//   [0.411, 0.98 - 0.6],
//   [0.398, 0.98 - 0.592],
//   [0.388, 0.98 - 0.673],
//   [0.34, 0.98 - 0.593],
//   [0.294, 0.98 - 0.594],
//   [0.292, 0.98 - 0.552],
//   [0.44, 0.98 - 0.552],
//   [0.29, 0.98 - 0.52],
//   [0.29, 0.98 - 0.462],
//   [0.29, 0.98 - 0.404],
//   [0.371, 0.98 - 0.463],
//   [0.284, 0.98 - 0.305],
//   [0.397, 0.98 - 0.3],
//   [0.383, 0.98 - 0.206],
//   [0.42, 0.98 - 0.427],
//   [0.45, 0.98 - 0.508],
//   [0.576, 0.98 - 0.299],
//   [0.603, 0.98 - 0.209],
//   [0.567, 0.98 - 0.426],
//   [0.533, 0.98 - 0.505],
//   [0.6, 0.98 - 0.478],
//   [0.723, 0.98 - 0.403],
//   [0.54, 0.98 - 0.554],
//   [0.722, 0.98 - 0.554],
//   [0.722, 0.98 - 0.513],
//   [0.722, 0.98 - 0.596],
//   [0.512, 0.98 - 0.633],
//   [0.632, 0.98 - 0.6],
//   [0.625, 0.98 - 0.685],
//   [0.705, 0.98 - 0.794],
//   [0.666, 0.98 - 0.762],
//   [0.791, 0.98 - 0.85],
//   [0.67, 0.98 - 0.93],
//   [0.842, 0.98 - 0.63],
//   [0.587, 0.98 - 0.887],
//   [0.488, 0.98 - 0.967],
//   [0.306, 0.98 - 0.814],
//   [0.331, 0.98 - 0.777],
//   [0.229, 0.98 - 0.883],
//   [0.349, 0.98 - 0.907],
//   [0.191, 0.98 - 0.782],
//   [0.07, 0.98 - 0.673],
//   [0.036, 0.98 - 0.553],
//   [0.036, 0.98 - 0.433],
//   [0.066, 0.98 - 0.311],
//   [0.138, 0.98 - 0.183],
//   [0.229, 0.98 - 0.089],
//   [0.306, 0.98 - 0.047],
//   [0.405, 0.98 - 0.02],
//   [0.495, 0.98 - 0.01],
//   [0.585, 0.98 - 0.02],
//   [0.677, 0.98 - 0.047],
//   [0.756, 0.98 - 0.091],
//   [0.858, 0.98 - 0.197],
//   [0.922, 0.98 - 0.322],
//   [0.948, 0.98 - 0.464],
//   [0.944, 0.98 - 0.551],
//   [0.921, 0.98 - 0.65],
// ];

// function togglehands() {
//   var groups = layer.find((node) => node instanceof Konva.Group);
//   groups.forEach((group) => {
//     group.x(width - group.x());
//   });

//   var name = $("#name0").val();
//   if (name === "") {
//     name = "Batter";
//   }
//   if ($("#left-handed").is(":checked")) {
//     bat.rotate(-60);
//     stage.find("#battername")[0].text("Batter: " + name + " (LH)");
//   } else {
//     bat.rotate(60);
//     stage.find("#battername")[0].text("Batter: " + name + " (RH)");
//   }

//   var tmp = [];
//   for (var i = 0; i < allposcoord.length; i++) {
//     var tm = [0.98 - allposcoord[i][0], allposcoord[i][1]];
//     tmp.push(tm);
//   }
//   allposcoord = tmp;
//   layer.draw();
// }

// function save_position() {
//   var groups = layer.find((node) => node instanceof Konva.Group);
//   var save_state = {};
//   save_state["left-handed"] = $("#left-handed").is(":checked");
//   save_state["bowlername"] = stage.find("#bowlername")[0].text();
//   save_state["battername"] = stage.find("#battername")[0].text();
//   save_state["fielders"] = [];
//   save_state["names"] = [];

//   groups.forEach((group) => {
//     text = group.getChildren()[1];
//     if (text instanceof Konva.Text) {
//       save_state["fielders"].push([group.x(), group.y(), text.text()]);
//     }
//   });
//   for (var i = 0; i <= positions.length; i++) {
//     save_state["names"].push($("#name" + i.toString()).val());
//   }

//   const jsonString = JSON.stringify(save_state, null, 2);
//   const blob = new Blob([jsonString], { type: "application/json" });
//   const link = document.createElement("a");
//   link.download =
//     stage.find("#bowlername")[0].text() +
//     "_to_" +
//     stage.find("#battername")[0].text().substring(8).replace(" ", "_") +
//     "_placement.json";
//   link.href = window.URL.createObjectURL(blob);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }

// function load_position(input) {
//   var file = input.files[0];
//   console.log(file.name);
//   if (file) {
//     // Display the selected file name
//     var fileName = file.name;
//     var reader = new FileReader();
//     console.log(file.name);
//     reader.onload = function (e) {
//       var content = e.target.result;
//       try {
//         var jsonObject = JSON.parse(content);
//         console.log(jsonObject["left-handed"]);
//         if (jsonObject["left-handed"]) {
//           if (!$("#left-handed").is(":checked")) {
//             $("#left-handed").prop("checked", true);
//             togglehands();
//           } else {
//             $("#left-handed").prop("checked", true);
//           }
//         } else {
//           if ($("#left-handed").is(":checked")) {
//             $("#left-handed").prop("checked", false);
//             togglehands();
//           } else {
//             $("#left-handed").prop("checked", false);
//           }
//         }
//         stage.find("#bowlername")[0].text(jsonObject["bowlername"]);
//         stage.find("#battername")[0].text(jsonObject["battername"]);

//         for (var i = 0; i <= positions.length; i++) {
//           $("#name" + i.toString()).val(jsonObject["names"][i]);
//         }

//         var groups = layer.find((node) => node instanceof Konva.Group);
//         var counter = 0;
//         groups.forEach((group) => {
//           text = group.getChildren()[1];
//           tbox = group.getChildren()[2];
//           if (text instanceof Konva.Text) {
//             console.log(jsonObject["fielders"][counter]);
//             group.x(jsonObject["fielders"][counter][0]);
//             group.y(jsonObject["fielders"][counter][1]);
//             text.text(jsonObject["fielders"][counter][2]);
//             counter += 1;

//             if (tbox.id().substring(0, 3) == "pos") {
//               var abspos = [group.x() / width, group.y() / height];
//               var newtext = allpos[nearest_neighbor(abspos, allposcoord)];
//               tbox.text(newtext);
//             }
//           }
//         });
//         layer.draw();
//       } catch (error) {
//         showAlert("Invalid JSON file. Please check the file and try again.");
//       }
//     };
//     reader.readAsText(file);
//     input.value = "";
//     document.getElementById("fileName").textContent = "";
//   }
// }

// function dist(a, b) {
//   return (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]);
// }

// function nearest_neighbor(query, bank) {
//   var ret = 0;
//   var distmp = 1000;
//   for (var i = 0; i < bank.length; i++) {
//     var dis = dist(query, bank[i]);
//     if (distmp > dis) {
//       ret = i;
//       distmp = dis;
//     }
//   }
//   return ret;
// }
// $("#names").append(
//   '<input type="text" class="form-control mb-3" id="name' +
//     (0).toString() +
//     '" placeholder="Batter name" onchange="changename(' +
//     (0).toString() +
//     ')">'
// );

// for (var i = 0; i < positions.length; i++) {
//   $("#names").append(
//     '<input type="text" class="form-control mb-2" id="name' +
//       (i + 1).toString() +
//       '" placeholder="Player ' +
//       (i + 1).toString() +
//       '" onchange="changename(' +
//       (i + 1).toString() +
//       ')">'
//   );
// }

// function changename(ind) {
//   if (ind == "0") {
//     var name = $("#name" + ind.toString()).val();
//     if (name === "") {
//       name = "batter";
//     }
//     if ($("#left-handed").is(":checked")) {
//       stage.find("#battername")[0].text("Batter: " + name + " (LH)");
//     } else {
//       stage.find("#battername")[0].text("Batter: " + name + " (RH)");
//     }
//   } else {
//     stage.find("#" + ind.toString())[0].text($("#name" + ind.toString()).val());
//     if (ind == "2") {
//       stage.find("#bowlername")[0].text($("#name" + ind.toString()).val());
//     }
//   }

//   layer.draw();
// }

// var yellowGroup = getPlayerGroup(
//   positions[0][0] * width,
//   positions[0][1] * height
// );
// var textNode1 = getTextNode(stage.getContainer().getBoundingClientRect(), 1);
// var textNode2 = getPosNode(
//   stage.getContainer().getBoundingClientRect(),
//   "WK",
//   "wk"
// );
// yellowGroup.add(getYellowPlayer()).add(textNode1).add(textNode2);
// layer.add(yellowGroup);
// stage.add(layer);

// var redGroup = getPlayerGroup(
//   positions[1][0] * width,
//   positions[1][1] * height
// );
// var textNode1 = getTextNode(stage.getContainer().getBoundingClientRect(), 2);
// var textNode2 = getPosNode(
//   stage.getContainer().getBoundingClientRect(),
//   "bowler",
//   "bowler"
// );
// redGroup.add(getRedPlayer()).add(textNode1).add(textNode2);
// layer.add(redGroup);
// stage.add(layer);

// for (var i = 2; i < positions.length; i++) {
//   var playerGroup = getPlayerGroup(
//     positions[i][0] * width,
//     positions[i][1] * height
//   );
//   var text = getTextNode(stage.getContainer().getBoundingClientRect(), i + 1);
//   var abspos = [positions[i][0], positions[i][1]];

//   var textNode2 = getPosNode(
//     stage.getContainer().getBoundingClientRect(),
//     allpos[nearest_neighbor(abspos, allposcoord)],
//     "pos" + i.toString()
//   );
//   playerGroup.add(getBluePlayer()).add(text).add(textNode2);
//   layer.add(playerGroup);
//   stage.add(layer);
// }
// bname = getBowler("Bowler");
// battername = getBatter("Batter: Batter (RH)");
// layer.add(bname);
// layer.add(battername);
// stage.add(layer);

// stage.on("dragend", function (e) {
//   console.log();
//   var posx = e.target.x();
//   var posy = e.target.y();
//   var tbox = e.target.getChildren()[2];
//   if (tbox.id().substring(0, 3) == "pos") {
//     var abspos = [posx / width, posy / height];
//     var newtext = allpos[nearest_neighbor(abspos, allposcoord)];
//     tbox.text(newtext);
//     layer.draw();
//   }
// });

// function hidepname() {
//   if ($("#pname").is(":checked")) {
//     for (var i = 0; i < positions.length; i++) {
//       stage.find("#" + (i + 1).toString())[0].show();
//     }
//   } else {
//     for (var i = 0; i < positions.length; i++) {
//       stage.find("#" + (i + 1).toString())[0].hide();
//     }
//   }
//   layer.draw();
// }

// function hideposname() {
//   if ($("#posname").is(":checked")) {
//     stage.find("#wk")[0].show();
//     stage.find("#bowler")[0].show();
//     for (var i = 2; i < positions.length; i++) {
//       stage.find("#pos" + i.toString())[0].show();
//     }
//   } else {
//     stage.find("#wk")[0].hide();
//     stage.find("#bowler")[0].hide();
//     var fielders = stage.find("#pos");
//     for (var i = 2; i < positions.length; i++) {
//       stage.find("#pos" + i.toString())[0].hide();
//     }
//   }
//   layer.draw();
// }
