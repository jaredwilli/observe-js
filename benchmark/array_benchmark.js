// Copyright 2013 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


(function(global) {
  var objectCount = 100;
  var dirtyCheckTimes = 50;
  var arrays;
  var observer = new ChangeSummary(function() {});
  var elementCount = 100;

  function createAndObserveArrays() {
    arrays = [];
    for (var i = 0; i < objectCount; i++) {
      var array = [];
      for (var j = 0; j < elementCount; j++)
        array.push(j);

      observer.observeArray(array);
      arrays.push(array);
    }
  }

  function mutateArraysAndDeliver(mutationFreq, op, undoOp) {
    var modVal = mutationFreq ? Math.floor(100/mutationFreq) : 0;
    var modCount = mutationFreq ? Math.max(1, Math.floor(elementCount * (mutationFreq / 100))) : 0;

    for (var i = 0; i < dirtyCheckTimes; i++) {
      if (modVal) {
        for (var j = 0; j < arrays.length; j++) {
          if ((j % modVal == 0)) {
            var array = arrays[j];
            for (var k = 0; k < modCount; k++) {
              if (i % 2)
                array[op](k);
              else
                array[undoOp](k);
            }
          }
        }
      }

      observer.deliver();
    }
  }

  global.createAndObserveArrays = createAndObserveArrays;
  global.mutateArraysAndDeliver = mutateArraysAndDeliver;
})(this);