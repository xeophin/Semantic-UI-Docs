/*!
 * # Semantic UI - Slider
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2015 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.fn.slider = function(parameters) {
  var
    $allModules    = $(this),
    moduleSelector = $allModules.selector || '',

    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),
    returnedValue
  ;

  $allModules
    .each(function() {
      var
        settings        = $.extend(true, {}, $.fn.slider.settings, parameters),

        className       = settings.className,
        namespace       = settings.namespace,
        metadata        = settings.metadata,
        selector        = settings.selector,
        error           = settings.error,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,

        $module         = $(this),
        $bar            = $module.find(selector.bar),
        $handles        = $module.find(selector.handle),
        $value          = $module.find(selector.value),
        $input          = $module.find(selector.input),
        input           = $input[0],

        // used only with range
        $bottomHandle,
        $topHandle,

        instance        = $module.data(moduleNamespace),

        cache,
        min,
        max,

        observer,
        element         = this,
        module

      ;

      module      = {

        initialize: function() {
          module.verbose('Initializing slider', settings);

          if( module.is.nativeSlider() ) {
            module.setup.layout();
          }

          module.read.metadata();

          module.bind.events();
          module.set.tabbable();

          module.observeChanges();
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.verbose('Destroying module');
          module.unbind.events();
          $module.removeData(moduleNamespace);
        },

        setup: {
          cache: function() {
            if(!module.cache) {
              module.cache = {
                bar: {},
              };
            }
          },
          layout: function() {
            //
          }
        },

        refresh: function() {

        },

        observeChanges: function() {
          if('MutationObserver' in window) {
            observer = new MutationObserver(function(mutations) {
              module.debug('DOM tree modified, updating selector cache');
              module.refresh();
            });
            observer.observe(element, {
              childList : true,
              subtree   : true
            });
            module.debug('Setting up mutation observer', observer);
          }
        },

        attachEvents: function(selector, event) {
          var
            $element = $(selector)
          ;
          event = $.isFunction(module[event])
            ? module[event]
            : module.toggle
          ;
          if($element.length > 0) {
            module.debug('Attaching slider events to element', selector, event);
            $element
              .on('click' + eventNamespace, event)
            ;
          }
          else {
            module.error(error.notFound);
          }
        },

        event: {
          handle: {
            mousedown: function() {
              // drag handle
            },
            mouseup: function() {
              // stop drag
            }
          }
        },

        is: {
          nativeSlider: function() {
            var
              type = $module.prop('type')
            ;
            return $module.is('input') && (type == 'slider' || type == 'range');
          }
        },

        should: {

        },

        can: {

        },

        determine: {
          logStep: function() {
            // need to research algorithm
          },
          expStep: function() {
            // need to research algorithm
          }
        },

        read: {
          metadata: function() {
            var
              data = {
                min  : $module.data(metadata.min),
                max  : $module.data(metadata.max),
                step : $module.data(metadata.step)
              }
            ;
            if(data.min) {
              module.debug('Current min step set from metadata', data.min);
              module.set.min(data.min);
            }
            if(data.max) {
              module.debug('Total step set from metadata', data.max);
              module.set.max(data.max);
            }
            if(data.step) {
              module.debug('Current step set from metadata', data.step);
              module.set.step(data.step);
            }
          }
        },

        position: {
          handle: function() {
            // determine px distance from left / right bound on $module
            //
          }
        },

        save: {
          calculations: function() {
            cache.bar = {
              width: $module.width()
            };
          }
        },

        get: {
          possibleMaxSteps: function() {
            Math.parseInt(module.cache.width / settings.minPixelsPerStep, 10);
          },
          bottomPercentage: function() {
            module.get.percentageSet($bottomHandle);
          },
          topPercentage: function() {
            module.get.percentageSet($topHandle);
          },
          percentageSet: function($handle) {
            $handle = $handle || $handles.eq(0);
            // (handle left + 1/2 width) / (module right - module left offset)
          },
          step: function() {
            if(typeof settings.step == 'integer') {
              return settings.step;
            }
            if(settings.step === 'auto') {
              if(min > 0 && min < 1) {
                return 0.01;
              }
              else {
                if( module.has.normalRange() ) {
                  return 1;
                }
                else {
                  return module.get.scaledStep();
                }
              }
            }
            if(settings.step == 'scaled') {
              return module.get.scaledStep();
            }
          },
          scaledStep: function() {
            // determine current range by
          },
          value: function() {
            return $input.val() || $module.data(metadata.value);
          }
        },

        set: {

          dragging: function() {
            $module.addClass(className.pressed);
          },

          min: function(min) {
            min = min;
            module.position.handle();
          },
          max: function(max) {
            max = max;
            module.position.handle();
          },
          step: function(step) {
            step = step;
            module.position.handle();
          },
          tabbable: function() {
            $handles.each(function() {
              module.verbose('Adding tabindex to handle', this);
              if( $(this).attr('tabindex') === undefined) {
                $input.attr('tabindex', 0);
              }
            });
          },
          value: function() {

          }
        },

        remove: function() {
          $module.removeClass(className.pressed);
        },

        create: {
          layout: function() {

          }
        },

        has: {
          normalRange: function() {

          }
        },

        bind: {
          events: function() {
            module.verbose('Attaching slider events');
            $handles
              .on('mousedown', event.handle.mousedown)
            ;
          }
        },

        unbind: {
          events: function() {
            module.debug('Removing events');
            $module
              .off(eventNamespace)
            ;
          }
        },


        // Standard
        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          instance.invoke('destroy');
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.slider.settings = {

  name             : 'Slider',
  namespace        : 'slider',

  debug            : false,
  verbose          : true,
  performance      : true,

  minPixelsPerStep : 10,
  preferInteger    : true,

  min              : 0,
  max              : false,
  step             : 'auto',

  className        : {
    pressed: 'pressed'
  },

  error     : {
    method       : 'The method you called is not defined'
  },

  metadata: {
    min   : 'min',
    max   : 'max',
    step  : 'step',
    value : 'value'
  },

  selector : {
    bar    : '> .bar',
    handle : '> .handle',
    value  : '> .value',
    input  : '> input'
  },

  templates: {
    slider: function() {
      // create from input[type="slider"]
    },
    range: function() {
      // create from input[type="range"]
    }
  }

};

})( jQuery, window , document );
