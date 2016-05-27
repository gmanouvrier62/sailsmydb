
//Mode local<script src="external/jquery/jquery.js"></script>
requirejs.config({
    paths: {
      'pnotify': './pnotify.custom.min',
      'jquery' :    './jquery_ui/external/jquery/jquery',
      'jquery-ui' : './jquery_ui/jquery-ui',
      'slider'   :  './jQRangeSlider-5.7.2/jQRangeSlider-min',
      'groupes' : './composant/selection_groupe',
      'occu' : './composant/occurences',
      'gogo' : './release/go',
      'mesreductions': './mesreductions'

      
    },
    // Bootstrap is a "browser globals" script :-(
    shim: {
        'jquery-ui': {
            exports: '$'
        }
      },
      'jquery-ui': { deps: ['jquery']},
      'sliders' : {deps: ['jquery']}
  });


/*

requirejs.config({
    paths: {
      'bootstrap': '{{ url("assets/local_dep/bootstrap.min") }}',
      'fuelux': '{{ url("assets/local_dep/fuelux.min") }}',
      'jquery': '{{ url("assets/local_dep/jquery") }}',
      'welcome': '{{ url("assets/js/welcome/welcome") }}',
      'chart': '{{ url("assets/local_dep/chart/Chart") }}',
     
    },

    shim: {
        'jquery': {
            exports: '$'
        },
        'bootstrap': { deps: ['jquery'] },
        'fuelux': { deps: ['bootstrap'] },
        'welcome': { deps: ['fuelux'] }, 
        'chart': { deps: ['bootstrap']}
            }
  });



*/
