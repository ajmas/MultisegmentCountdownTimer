// The MIT License (MIT)
// Copyright (c) 2016 Andre Mas
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies
// or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR
// THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// Target Javascript: ECMAScript 5
// Project home: http://github.com/ajmas/MultisegmentCountdownTimer
function MultisegmentCountdownTimer(config) {

    this.countdownConfig = {}
    this.currentSegmentIdx = undefined;
    this.defaultRefreshInterval = 60000;

    this.clearCountdown = function() {
        document.getElementById(this.countdownConfig.elementId).innerHTML = '';

    }

    // TODO probably should be time in seconds?
    this.drawCountdown = function(days, hours, minutes, seconds, segmentId) {
        var labels = this.countdownConfig.labels;

        document.getElementById(this.countdownConfig.elementId).innerHTML = ('<div>' + labels['days'] + ': ' + days + ', ' + labels['hours'] + ': ' + hours + ', ' + labels['minutes'] + ': ' + minutes + ', ' + labels['seconds'] + ': ' + seconds + ', Segment: ' + segmentId + '</div>');
    }

    this.handlePostCountdown = function() {
        if (!this.countdownConfig.hideAfterFinalTarget) {
            this.drawCountdown(0, 0, 0, 0, 0);
        } else {
            this.clearCountdown();
        }
        if (this.countdownConfig.postTargetAction) {
            this.countdownConfig.postTargetAction();
        }
    }


    this.updateCountdown = function() {
        var days, hours, minutes, timeDiff, targetTime, tmpTime, segments, scope;
        var currentDate = new Date();


        if (this.currentSegmentIdx === undefined ||
            Date.parse(this.countdownConfig.segments[this.currentSegmentIdx].targetDate) < currentDate.getTime()) {

            this.currentSegmentIdx = undefined;

            segments = this.countdownConfig.segments;

            for (i = 0; i < segments.length; i++) {
                var targetTime = Date.parse(this.countdownConfig.segments[i].targetDate);
                if (currentDate.getTime() < targetTime) {
                    this.currentSegmentIdx = i;
                    break;
                }
            }

            if (this.currentSegmentIdx !== undefined) {
                if (this.countdownConfig.segments[this.currentSegmentIdx].initAction) {
                    this.countdownConfig.segments[this.currentSegmentIdx].initAction();
                }
            }
        }

        if (this.currentSegmentIdx !== undefined) {
            var targetTime = Date.parse(this.countdownConfig.segments[this.currentSegmentIdx].targetDate);
            timeDiff = targetTime - currentDate.getTime();

            // Remove the milliseconds
            tmpTime = parseInt(timeDiff / 1000);

            seconds = tmpTime % 60;
            tmpTime = parseInt(tmpTime / 60);

            minutes = tmpTime % 60;
            tmpTime = parseInt(tmpTime / 60);

            hours = tmpTime % 24;
            tmpTime = parseInt(tmpTime / 24);

            days = tmpTime;

            this.drawCountdown(days, hours, minutes, seconds, this.currentSegmentIdx);

            scope = this;
            setTimeout(function() {
                scope.updateCountdown();
            }, this.countdownConfig.refreshInterval);
        } else {
            this.handlePostCountdown();

        }
    }


    this.countdownConfig = config;

    if (!this.countdownConfig.refreshInterval) {
        this.countdownConfig.refreshInterval = this.defaultRefreshInterval;
    }
    this.updateCountdown();
}