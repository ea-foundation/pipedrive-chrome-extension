$(document).ready(function() {
    /**
     * Check if element exists in DOM and is visible.
     * 
     * @param  {string}  className
     * @return {Boolean}
     */
    function isElementVisible(className) {
        return document.getElementsByClassName(className).length > 0 && $('.' + className).is(':visible');
    }

    /**
     * Callback handler for MutationObserver. Is called for every DOM change.
     * 
     * @param  {Mutation[]} mutations Array of Mutations
     */
    function mutationHandler(mutations) {
        mutations.forEach(function(mutation) {
          if (!foundDealsBox && isElementVisible('dealsOverview')) {
              foundDealsBox = true;
              personViewAdjustments();
          }

          if (!foundNavigation && document.getElementById('mainmenu')) {
              foundNavigation = true;
              navigationAdjustments();
          }

          if (document.location.href != url) {
              url = document.location.href;
              if (url.indexOf('/person') !== -1) {
                  foundDealsBox = false;
              }
          }
        }); 
    }

    /**
     * Modify elements in the person detail view.
     */
    function personViewAdjustments() {
        // Adjust Deals box in sidebar
        var totalDonations = $('.dealsOverview .legend .won>td:nth-child(2)').text();
        if (totalDonations == '') {
        	totalDonations = '0';
        }
        var totalAmount = $('.dealsOverview .legend .won>td:nth-child(4)').text();
        $('.dealsOverview .dealsTitle, .openDeals, .closedDealsChart').remove();
        $('.dealsOverview .columnItem').text('Deals (donations): ' + totalAmount);
        $('.dealsOverview .viewDeals span').text('See all deals (' + totalDonations + ')');

        // Change "Add deal" to "Expand notes"
        $('.buttonAddDeal span.primary').removeClass('primary').text('Expand notes');

        var notesCollapsed = true;
        $('.buttonAddDeal button').click(function (event) {
            if (notesCollapsed) {
                $('span', this).text('Collapse notes');
                $('.showMore').click();
                $('.pinnedNotes .expand').click();
                $('.expandMessage button').click();
            } else {
                $('span', this).text('Expand notes');
                $('.showLess').click();
                $('.pinnedNotes .collapse').click();
                $('.collapseMessage button').click();
            }
            notesCollapsed = !notesCollapsed;
            event.stopPropagation();
        });
    }

    /**
     * Modify elements in the navigation.
     */
    function navigationAdjustments() {
        if ($('.key-organizations')) {
          return;
        }
        $('.logo_container a').attr('href', '/persons'); // change logo target to person list
        $('.key-pipeline .label').text('Donations'); // change Deals to Donations
        $('.key-activities').after(
            '<li class="key-persons"><a href="/persons"><span class="icon icon-person" data-tooltip="Persons"></span><span class="label">Persons</span></a>',
            '<li class="key-organizations"><a href="/organizations"><span class="icon icon-organization" data-tooltip="Organizations"></span><span class="label">Organizations</span></a>'
        ); // add top-level items "Persons" and "Organizations"
        $('.key-contacts').remove(); // Remove dropdown Contacts item
    }

    // listen for URL changes
    window.addEventListener('popstate', function () {
        navigationAdjustments();
        personViewAdjustments();
    }, false);

    // initialize status variables
    var foundDealsBox = false;
    var foundNavigation = false;
    var url = document.location.href;

    // configure and create observer to listen for DOM changes
    target = document.body;
    var observer = new MutationObserver(mutationHandler);
    var config = { attributes: true, childList: true, subtree: true, characterData: true };
    observer.observe(target, config);
})