function Microphone(_fft) {
    var FFT_SIZE = _fft || 2048;

    this.spectrum = new Uint8Array(FFT_SIZE / 2);
    this.data = [];
    this.volume = this.vol = 0;
    this.peak_volume = 0;

    var self = this;
    var audioContext = new AudioContext();
    var SAMPLE_RATE = audioContext.sampleRate;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

    window.addEventListener("load", init, false);

    function init () {
        try {
            startMic(new AudioContext());
        } catch (e) {
            alert("Web Audio API is not supported in this browser");
        }
    }

    function startMic(context) {
        navigator.getUserMedia({ audio: true }, processSound, error);

        function processSound(stream) {
            // analyser extracts frequency, waveform, and other data
            var analyser = context.createAnalyser();

            analyser.smoothingTimeConstant = 0.2;
            analyser.fftSize = FFT_SIZE;

            var node = context.createScriptProcessor(FFT_SIZE * 2, 1, 1);

            node.onaudioprocess = function () {
                // getByteFrequencyData returns the amplitude for each frequency
                analyser.getByteFrequencyData(self.spectrum);
                self.data = adjustFreqData(self.spectrum);

                self.vol = self.getRMS(self.spectrum);

                if (self.vol > self.peak_volume) {
                    self.peak_volume = self.vol;
                }

                self.volume = self.vol;
            };

            var input = context.createMediaStreamSource(stream);

            input.connect(analyser);
            analyser.connect(node);
            node.connect(context.destination);
        }

        function error() {
            console.log(arguments);
        }
    }

    this.getVol = function () {
        // map total volume to 100 for convenience
        self.volume = map(self.vol, 0, self.peak_volume, 0, 100);

        return self.volume;
    };

    // A more accurate way to get overall volume
    this.getRMS = function (spectrum) {
        var rms = 0;

        for (var i = 0; i < spectrum.length; i++) {
            rms += spectrum[i] * spectrum[i];
        }

        rms /= spectrum.length;
        rms = Math.sqrt(rms);

        return rms;
    };

    // freq = n * SAMPLE_RATE / MY_FFT_SIZE
    function mapFreq(i) {
        return i * SAMPLE_RATE / FFT_SIZE;
    }

    // getMix function. Computes the current frequency with
    // computeFreqFromFFT, then returns bass, mids and his
    // sub bass : 0 > 100hz
    // mid bass : 80 > 500hz
    // mid range: 400 > 2000hz
    // upper mid: 1000 > 6000hz
    // high freq: 4000 > 12000hz
    // Very high freq: 10000 > 20000hz and above

    this.getMix = function () {
        var highs = [];
        var mids = [];
        var bass = [];

        for (var i = 0; i < self.spectrum.length; i++) {
            var band = mapFreq(i);
            var v = map(self.spectrum[i], 0, self.peak_volume, 0, 100);

            if (band < 500) {
                bass.push(v);
            }

            if (band > 400 && band < 6000) {
                mids.push(v);
            }

            if (band > 4000) {
                highs.push(v);
            }
        }

        return {
            bass: bass,
            mids: mids,
            highs: highs
        };
    };

    this.getHighsVol = function (_min, _max) {
        var min = _min || 0;
        var max = _max || 100;

        return map(this.getRMS(this.getMix().highs), 0, self.peak_volume, min, max);
    };

    this.getMidsVol = function (_min, _max) {
        var min = _min || 0;
        var max = _max || 100;

        return map(this.getRMS(this.getMix().mids), 0, self.peak_volume, min, max);
    };

    this.getBassVol = function (_min, _max) {
        var min = _min || 0;
        var max = _max || 100;

        return map(this.getRMS(this.getMix().bass), 0, self.peak_volume, min, max);
    };

    function adjustFreqData(frequencyData, ammt) {
        frequencyData.slice(0, frequencyData.length / 2);
        var new_length = ammt || 16;
        var newFreqs = [], prevRangeStart = 0, prevItemCount = 0;

        // looping for my new 16 items
        for (let j = 1; j <= new_length; j++) {
            var pow, itemCount, rangeStart;

            if (j % 2 === 1) {
                pow = (j - 1) / 2;
            } else {
                pow = j / 2;
            }

            itemCount = Math.pow(2, pow);

            if (prevItemCount === 1) {
                rangeStart = 0;
            } else {
                rangeStart = prevRangeStart + prevItemCount / 2;
            }

            // get average value, add to new array
            var newValue = 0, total = 0;

            for (var k = rangeStart; k < rangeStart + itemCount; k++) {
                total += frequencyData[k];
                newValue = total / itemCount;
            }

            newFreqs.push(newValue);
            prevItemCount = itemCount;
            prevRangeStart = rangeStart;
        }

        return newFreqs;
    }

    function map(value, min1, max1, min2, max2) {
        return (value - min1) / (max1 - min1) * (max2 - min2) + min2;
    }

    this.soundValues = function () {
        return {
            vol: Math.round(this.getVol()),
            bass: Math.round(self.getBassVol()),
            mids: Math.round(self.getMidsVol()),
            highs: Math.round(self.getHighsVol())
        };
    };

    return this;
}
