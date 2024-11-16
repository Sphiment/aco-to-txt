/* index.js - Modified to Output Only Color Hex Values */

var Local = (function() {

    var colors = [
      '#fafacc',
      '#dfedd6',
      '#b5d6c9',
      '#d5d6b4',
      '#96a69a',
      '#839c95',
      '#e95d44',
      '#6f5f5e'
    ];

    // 1- No shades, 2- One shade light, 3- One shade dark, 4- Two shades
    var shades = 1;

    // The lighter / darker degree of shades
    var shadeFactor = 10;

    // Function to output only color hex values
    function colorsToHex() {
      var hexValues = [];

      for (var i = 0; i < colors.length; i++) {
        
        // Get the color
        var color = tinycolor(colors[i]);

        // Get the color hex (master color)
        var colorHex = color.toHex();

        // Add the hex color to the array
        hexValues.push(colorHex);

        // If you want to include light and dark shades as well:
        if (shades > 1) {
          var lightColorHex = color.lighten(shadeFactor * 2).toHex();
          hexValues.push(lightColorHex);
        }
        if (shades > 2) {
          var darkColorHex = color.darken(shadeFactor).toHex();
          hexValues.push(darkColorHex);
        }
      }

      return hexValues.join('\n');
    }

    // Function to display the hex color values
    function showColorPalette(_colors) {
      colors = _colors || colors;
      var result = $("#result");

      // Get the color hex values and display them
      var hexOutput = colorsToHex();
      result.text(hexOutput);
    }

    function showShade(_shades) {
      shades = _shades || shades;
      showColorPalette();
    }

    var opts = {
        'aco-file-input' : {
          readAsDefault: 'BinaryString',
          on: {
            load: function(e, file) {
              showColorPalette(Aco.colors(e.target.result));
            }
          }
        },
        'image-file-input' : {
          on: {
            load: function(e, file) {
              var fileDiv = $("#group_" + file.extra.groupID + "_file_" + file.extra.fileID)
              if (file.type.match(/image/)) {
                // Create a thumbnail and add it to the output if it is an image
                var img = new Image();
                img.onload = function(){
                  $('#image').append(img);
                }
                img.src = e.target.result;

                var colorThief = new ColorThief();
                var _colors = colorThief.getPalette(img, 8);

                // Get the pallet colors
                colors = [];
                for (var i = 0; i < _colors.length; i++) {
                  var rgb = _colors[i];
                  colors.push(Aco.rgbToHex(rgb[0], rgb[1], rgb[2]));
                }

                showColorPalette();
              }
            }
          }
        }
    }

    function setShadeFactor(factor) {
        shadeFactor = factor;
        showColorPalette();
    }

    return {
        opts: opts,
        showShade: showShade,
        setShadeFactor: setShadeFactor
    };

})();

FileReaderJS.setupInput(document.getElementById('aco-file-input'), Local.opts['aco-file-input']);

$(function() {

  FileReaderJS.setSync(false);

  $("#source").on("change", function() {
    $("#aco-file-input").addClass('hidden');
    $("#image-file-input").addClass('hidden');

    var id = $("#source").val();

    // Change the File input source
    FileReaderJS.setupInput(document.getElementById(id), Local.opts[id]);
    $("#" + id).removeClass('hidden');
  });

  $("#clear-list").on("click", function() {
    $("#result").empty();
    $("#image").empty();
  });

  $("#shades").on("change", function() {
    Local.showShade($("#shades").val());
  });

  $("#shade_factor").on("change", function() {
    Local.setShadeFactor($("#shade_factor").val());
  });

});
