// Generated by CoffeeScript 1.8.0
(function() {
  var $, $$, $canvas, $colorPalette, $container, Shape, audioCtx, boot, buffer, calcConfig, config, construct, e, empty, future, log, make, queue, renderAudio, report, reset, resize, shapes, step, timestampNow;

  config = {
    backgroundTop: '#000066',
    backgroundBottom: 'black',
    containerAxis: '0,1,0',
    containerDegrees: '135',
    diffusePalette: 'green,cyan,red,cyan,red,cyan,red',
    specularPalette: 'green,#66ff99,yellow',
    emissivePalette: '#001103,#00ff11,#110011',
    xExtent: 8,
    yExtent: 8,
    zExtent: 8,
    xyzMinSum: 0,
    xyzMaxSum: 8,
    xGap: .4,
    yGap: .6,
    zGap: .4,
    spaceScatter: .2,
    timeScatter: 2,
    propagationRate: 250,
    clickDuration: 1000,
    clickPower: 4,
    diminishFactor: .5
  };

  calcConfig = function() {
    config.clickPowerDiffDivider = config.clickDuration / config.clickPower;
    config.propagationRate = parseInt(config.propagationRate, 10);
    config.spaceScatter = parseFloat(config.spaceScatter);
    config.timeScatter = parseFloat(config.timeScatter);
    config.diffusePalette = config.diffusePalette.split(',');
    config.specularPalette = config.specularPalette.split(',');
    return config.emissivePalette = config.emissivePalette.split(',');
  };

  $canvas = null;

  $container = null;

  $colorPalette = null;

  window.buffer = buffer = [];

  window.shapes = shapes = [];

  window.queue = queue = [];

  window.future = future = [];

  try {
    audioCtx = new window.AudioContext;
  } catch (_error) {
    e = _error;
    log(e);
  }

  reset = function() {
    var $a, $el, color, colorIndex, i, j, k, key, l, noteNum, value, x, y, z, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _n, _ref, _ref1;
    for (key in config) {
      value = config[key];
      $el = $('#' + key);
      if (!$el) {
        continue;
      }
      config[key] = $el.value;
    }
    calcConfig();
    buffer = [];
    for (colorIndex = _i = 0; _i <= 2; colorIndex = ++_i) {
      buffer[colorIndex] = [];
      for (noteNum = _j = 0, _ref = config.yExtent; 0 <= _ref ? _j <= _ref : _j >= _ref; noteNum = 0 <= _ref ? ++_j : --_j) {
        renderAudio(noteNum, colorIndex);
      }
    }
    empty($colorPalette);
    _ref1 = config.diffusePalette;
    for (i = _k = 0, _len = _ref1.length; _k < _len; i = ++_k) {
      color = _ref1[i];
      $a = make('appearance', {
        def: "flat-" + i
      });
      $a.appendChild(make('material', {
        diffuseColor: color,
        specularColor: config.specularPalette[i] || 'black',
        emissiveColor: config.emissivePalette[i] || 'black'
      }));
      $colorPalette.appendChild($a);
    }
    for (j = _l = 0, _len1 = shapes.length; _l < _len1; j = ++_l) {
      x = shapes[j];
      for (k = _m = 0, _len2 = x.length; _m < _len2; k = ++_m) {
        y = x[k];
        for (l = _n = 0, _len3 = y.length; _n < _len3; l = ++_n) {
          z = y[l];
          delete y[l];
        }
        delete x[k];
      }
      delete shapes[j];
    }
    return empty($container);
  };

  $ = document.querySelector.bind(document);

  $$ = document.querySelectorAll.bind(document);

  log = function(html, append) {
    var $pre;
    if (append == null) {
      append = true;
    }
    $pre = $('pre');
    if ($pre) {
      if (html) {
        if (append) {
          $pre.innerHTML += '\n' + html;
        } else {
          $pre.innerHTML = html;
        }
        $pre.scrollTop = $pre.scrollHeight;
        return console.log(html);
      } else {
        return $pre.innerHTML;
      }
    }
  };

  window.report = report = function() {
    return "queue: " + queue.length + " future: " + future.length;
  };

  resize = function() {
    if ($canvas) {
      $canvas.style.width = (window.innerWidth * .8 - 40) + 'px';
      return $canvas.style.height = window.innerHeight + 'px';
    }
  };

  make = function(tag, attr, inner) {
    var el, key, value;
    el = document.createElement(tag);
    for (key in attr) {
      value = attr[key];
      el.setAttribute(key, value);
    }
    if (inner) {
      el.innerHTML = inner;
    }
    return el;
  };

  empty = function(node) {
    var _results;
    _results = [];
    while (node.hasChildNodes()) {
      _results.push(node.removeChild(node.lastChild));
    }
    return _results;
  };

  Shape = (function() {
    function Shape(x, y, z) {
      var s, shapeTag;
      this.x = x;
      this.y = y;
      this.z = z;
      this.t = make('transform', {
        translation: "" + (this.x * config.xGap + this.rndSpace()) + " " + (this.y * config.yGap + this.rndSpace()) + " " + (this.z * config.zGap + this.rndSpace())
      });
      s = make('shape', {
        onclick: "window.shapes[" + this.x + "][" + this.y + "][" + this.z + "].clicked()"
      });
      shapeTag = ['cone', 'cylinder', 'sphere', 'torus', 'box'][Math.floor(Math.random() * 5 * (this.x / config.xExtent))];
      s.appendChild(make(shapeTag, {
        use: 'small-' + shapeTag
      }));
      this.colorIndex = Math.floor(Math.random() * config.diffusePalette.length * ((this.x / config.xExtent) + (this.z / config.zExtent)) / 2);
      s.appendChild(make('appearance', {
        use: 'flat-' + this.colorIndex
      }));
      this.t.appendChild(s);
      $container.appendChild(this.t);
    }

    Shape.prototype.rndSpace = function() {
      return (Math.random() - .5) * config.spaceScatter;
    };

    Shape.prototype.rndTime = function() {
      return (Math.random() - .5) * config.timeScatter;
    };

    Shape.prototype.clickTime = 0;

    Shape.prototype.clicked = function(factor, way) {
      var gainNode, jobs, source;
      this.factor = factor != null ? factor : 1;
      this.way = way != null ? way : false;
      if (0 !== this.clickTime) {
        console.log('Already playing', this.x, this.y, this.z);
      }
      if (0 === this.clickTime) {
        this.clickTime = timestampNow;
        this.render(timestampNow);
        queue.push(this);
        factor = this.factor * config.diminishFactor;
        try {
          source = audioCtx.createBufferSource();
          source.buffer = buffer[this.colorIndex][this.y];
          gainNode = audioCtx.createGain();
          source.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          gainNode.gain.value = factor;
          source.start();
        } catch (_error) {
          e = _error;
          log(e);
        }
        if (.01 < factor) {
          jobs = [];
          if (shapes[this.x + 1] && shapes[this.x + 1][this.y] && shapes[this.x + 1][this.y][this.z] && ('+x' === this.way || !this.way)) {
            jobs.push({
              shape: shapes[this.x + 1][this.y][this.z],
              factor: factor,
              way: '+x'
            });
          }
          if (shapes[this.x - 1] && shapes[this.x - 1][this.y] && shapes[this.x - 1][this.y][this.z] && ('-x' === this.way || !this.way)) {
            jobs.push({
              shape: shapes[this.x - 1][this.y][this.z],
              factor: factor,
              way: '-x'
            });
          }
          if (shapes[this.x][this.y + 1] && shapes[this.x][this.y + 1] && shapes[this.x][this.y + 1][this.z] && ('+y' === this.way || !this.way)) {
            jobs.push({
              shape: shapes[this.x][this.y + 1][this.z],
              factor: factor,
              way: '+y'
            });
          }
          if (shapes[this.x][this.y - 1] && shapes[this.x][this.y - 1] && shapes[this.x][this.y - 1][this.z] && ('-y' === this.way || !this.way)) {
            jobs.push({
              shape: shapes[this.x][this.y - 1][this.z],
              factor: factor,
              way: '-y'
            });
          }
          if (shapes[this.x][this.y][this.z + 1] && shapes[this.x][this.y] && shapes[this.x][this.y][this.z + 1] && ('+z' === this.way || !this.way)) {
            jobs.push({
              shape: shapes[this.x][this.y][this.z + 1],
              factor: factor,
              way: '+z'
            });
          }
          if (shapes[this.x][this.y][this.z - 1] && shapes[this.x][this.y] && shapes[this.x][this.y][this.z - 1] && ('-z' === this.way || !this.way)) {
            jobs.push({
              shape: shapes[this.x][this.y][this.z - 1],
              factor: factor,
              way: '-z'
            });
          }
          if (0 < jobs.length) {
            return future.push({
              timestamp: timestampNow + (config.propagationRate * (1 - this.rndTime())),
              jobs: jobs
            });
          }
        }
      }
    };

    Shape.prototype.render = function(timestamp) {
      var diff, scale;
      diff = timestamp - this.clickTime;
      scale = config.clickPower - diff / config.clickPowerDiffDivider;
      if (config.clickDuration < diff) {
        this.clickTime = 0;
        scale = 0;
      }
      scale = scale * this.factor + 1;
      return this.t.setAttribute('scale', "" + scale + " " + scale + " " + scale);
    };

    return Shape;

  })();

  timestampNow = null;

  step = function(timestamp) {
    var index, job, length, shape, task, _i, _len, _ref, _ref1;
    timestampNow = timestamp;
    if (!$canvas) {
      $canvas = $('canvas');
      resize();
    }
    index = 0;
    length = future.length;
    while (index < length) {
      task = future[index];
      if (task.timestamp < timestamp) {
        _ref = task.jobs;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          job = _ref[_i];
          if ((_ref1 = job.shape) != null) {
            _ref1.clicked(job.factor, job.way);
          }
        }
        future.splice(index, 1);
        length--;
      } else {
        index++;
      }
    }
    index = 0;
    length = queue.length;
    while (index < length) {
      shape = queue[index];
      shape.render(timestamp);
      if (0 === shape.clickTime) {
        queue.splice(index, 1);
        length--;
      } else {
        index++;
      }
    }
    return window.requestAnimationFrame(step);
  };

  window.clicker = function(shape, scale) {
    if (scale == null) {
      scale = 4;
    }
    if (!shape.parentNode) {
      return;
    }
    if (1 > scale) {
      scale = 1;
    }
    shape.parentNode.setAttribute('scale', "" + scale + " " + scale + " " + scale);
    if (1 === scale) {
      return;
    }
    return setTimeout(function() {
      var _ref, _ref1, _ref2, _ref3;
      window.clicker((_ref = shapes[shape.x + 1]) != null ? _ref[shape.y][shape.z] : void 0, scale * .8);
      window.clicker((_ref1 = shapes[shape.x - 1]) != null ? _ref1[shape.y][shape.z] : void 0, scale * .8);
      window.clicker((_ref2 = shapes[shape.x][shape.y + 1]) != null ? _ref2[shape.z] : void 0, scale * .8);
      window.clicker((_ref3 = shapes[shape.x][shape.y - 1]) != null ? _ref3[shape.z] : void 0, scale * .8);
      window.clicker(shapes[shape.x][shape.y][shape.z + 1], scale * .8);
      return window.clicker(shapes[shape.x][shape.y][shape.z - 1], scale * .8);
    }, 100);
  };

  boot = function() {
    var $fieldset, button, key, label, value;
    log('Booting...', false);
    $container = $('#container');
    $colorPalette = $('#colorPalette');
    $fieldset = $('fieldset');
    for (key in config) {
      value = config[key];
      label = make('label', {}, key + ':');
      label.appendChild(make('input', {
        id: key,
        value: value,
        onkeypress: "if (event.which == 13 || event.keyCode == 13) { construct() }"
      }));
      $fieldset.appendChild(label);
    }
    button = make('a', {
      onclick: 'construct()',
      "class": 'button'
    }, 'Rebuild');
    $fieldset.appendChild(button);
    return construct();
  };

  renderAudio = function(noteNum, colorBuffer) {
    var colorChoice, duration, freq, gainNode, i, octave, offlineCtx, renderTime, sounds, type, _i, _len;
    try {
      freq = [44100 * 32 * 1 / 5400, 44100 * 32 * 5 / 4 / 5400, 44100 * 32 * 3 / 2 / 5400, 44100 * 32 * 1 * 2 / 5400, 44100 * 32 * 9 / 4 / 5400, 44100 * 32 * 5 / 2 / 5400, 44100 * 32 * 3 / 5400, 44100 * 32 * 4 / 5400, 44100 * 32 * 9 / 2 / 5400, 44100 * 32 * 5 / 5400][noteNum];
      colorChoice = [['sine', 'square'], ['sine', 'sine', 'triangle', 'triangle'], ['sine', 'sawtooth']][colorBuffer];
      octave = [1, .5, .25][colorBuffer];
      duration = 1;
      offlineCtx = new OfflineAudioContext(1, 44100 * duration, 44100);
      offlineCtx.oncomplete = function(evt) {
        var elapsed;
        buffer[colorBuffer].push(evt.renderedBuffer);
        return elapsed = Math.round((audioCtx.currentTime - renderTime) * 1000000) / 1000;
      };
      sounds = (function() {
        var _i, _results;
        _results = [];
        for (i = _i = 0; _i <= 3; i = ++_i) {
          _results.push(offlineCtx.createOscillator());
        }
        return _results;
      })();
      for (i = _i = 0, _len = colorChoice.length; _i < _len; i = ++_i) {
        type = colorChoice[i];
        sounds[i].type = type;
        sounds[i].frequency.value = (freq + Math.floor(Math.random() * 5)) * octave;
        gainNode = offlineCtx.createGain();
        sounds[i].connect(gainNode);
        gainNode.connect(offlineCtx.destination);
        gainNode.gain.exponentialRampToValueAtTime(0.01, offlineCtx.currentTime + 1);
        sounds[i].start();
      }
      offlineCtx.startRendering();
      return renderTime = audioCtx.currentTime;
    } catch (_error) {
      e = _error;
      return log(e);
    }
  };

  window.construct = construct = function() {
    var x, xyzSum, y, z, _base, _i, _j, _k, _ref, _ref1, _ref2;
    log('Constructing...');
    reset();
    resize();
    $('html').style.backgroundColor = config.backgroundBottom;
    $('body').style.backgroundImage = "linear-gradient(180deg, " + config.backgroundTop + ", " + config.backgroundBottom + ")";
    $('body').style.backgroundRepeat = "no-repeat";
    $container.setAttribute('translation', "-" + (config.xExtent * config.xGap / 2) + " -" + (config.yExtent * config.yGap / 2) + " -" + (config.zExtent * config.zGap / 2));
    $container.setAttribute('rotation', config.containerAxis + ' ' + (config.containerDegrees * 0.01745329251));
    $container.setAttribute('center', "" + (config.xExtent * config.xGap / 2) + " " + (config.yExtent * config.yGap / 2) + " " + (config.zExtent * config.zGap / 2));
    for (x = _i = 0, _ref = config.xExtent; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
      for (y = _j = 0, _ref1 = config.yExtent; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
        for (z = _k = 0, _ref2 = config.zExtent; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; z = 0 <= _ref2 ? ++_k : --_k) {
          xyzSum = x + y + z;
          if ((config.xyzMinSum <= xyzSum && xyzSum <= config.xyzMaxSum)) {
            if (shapes[x] == null) {
              shapes[x] = [];
            }
            if ((_base = shapes[x])[y] == null) {
              _base[y] = [];
            }
            shapes[x][y][z] = new Shape(x, y, z);
          }
        }
      }
    }
    return window.requestAnimationFrame(step);
  };

  window.addEventListener('load', boot);

  window.addEventListener('resize', resize);

}).call(this);
