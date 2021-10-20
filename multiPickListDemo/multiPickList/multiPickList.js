import {LightningElement, api, track} from 'lwc';
export default class MultiPickList extends LightningElement {

    @api label  = ''; //Name of the dropDown
    @api maxselected  = 3; //Max selected item display
    @api options; // List of items to display
    @api showfilterinput = false; //show filterbutton
    @api showrefreshbutton = false; //show the refresh button
    @api showclearbutton = false; //show the clear button
    @api comboplaceholder = 'Select a value'; 
    
    @track _initializationCompleted = false;
    @track _selectedItems = 'Select a value';
    @track _filterValue;
    @track _mOptions;
    constructor () {
        super();
        this._filterValue = '';
        //this.showfilterinput = true;
        //this.showrefreshbutton = true;
        //this.showclearbutton = true;
    }
    renderedCallback () {
        let self = this;
        if (!this._initializationCompleted) {
            this.template.querySelector ('.ms-input').addEventListener ('click', function (event) {
                console.log ('multipicklist clicked');
                self.onDropDownClick(event.target);
                event.stopPropagation ();
            });
            this.template.addEventListener ('click', function (event) {
                console.log ('multipicklist-1 clicked');
                event.stopPropagation ();
            });
            document.addEventListener ('click', function (event) {
                console.log ('document clicked');
                self.closeAllDropDown();
            });
            this._initializationCompleted = true;
            this.setPickListName ();
        }
    }
    handleItemSelected (event) {
        //console.log(this);
        let self = this;
        //console.log(self);
        this._mOptions.forEach (function (eachItem) {
            if (eachItem.key == event.detail.item.key) {
                eachItem.selected = event.detail.selected;
                return;
            }
        });
        self.setPickListName ();
        self.onItemSelected ();
    }
    filterDropDownValues (event) {
        this._filterValue = event.target.value;
        this.updateListItems (this._filterValue);
    }
    closeAllDropDown () {
        Array.from (this.template.querySelectorAll ('.ms-picklist-dropdown')).forEach (function (node) {
             node.classList.remove('slds-is-open');
        });
    }
    onDropDownClick (dropDownDiv) {
        let classList = Array.from (this.template.querySelectorAll ('.ms-picklist-dropdown'));
        if(!classList.includes("slds-is-open")){
            this.closeAllDropDown();
            Array.from (this.template.querySelectorAll ('.ms-picklist-dropdown')).forEach (function (node) {
                node.classList.add('slds-is-open');
            });
        } else {
            this.closeAllDropDown();
        }
    }
    onRefreshClick (event) {
        this._filterValue = '';
        this.initArray (this);
        this.updateListItems ('');
        this.onItemSelected ();
    }
    @api
    parentRefreshClick (options) {
        let that = this;
        console.log('parentRefresh');
        this._filterValue = '';
        that._mOptions = new Array (); 
        if (options.length > 0) {
            options.forEach (function (eachItem) {
                that._mOptions.push (JSON.parse (JSON.stringify(eachItem)));
                console.log('itens no contexto:');
                console.log(JSON.parse (JSON.stringify(eachItem)));
            });
        }
        this.updateListItems ('');
        this.onItemSelected (); 
      
    }
    onClearClick (event) {
        this._filterValue = '';
        this.updateListItems ('');
    }
    connectedCallback () {  
        this.initArray (this);
    }
    initArray (context) {
        let self = this;
        console.log('initArray');
        console.log(JSON.parse (JSON.stringify(self.options)));
        console.log(JSON.parse (JSON.stringify(this.options)));
        context._mOptions = new Array ();  
        context.options.forEach (function (eachItem) {
            context._mOptions.push (JSON.parse (JSON.stringify(eachItem)));
            console.log('itens no contexto:');
            console.log(JSON.parse (JSON.stringify(eachItem)));
        });
    }
    updateListItems (inputText) {
        Array.from (this.template.querySelectorAll('c-pick-list-item')).forEach (function (node) {
            if(!inputText){
                node.style.display = "block";
            } else if(node.item.label.toString().toLowerCase().indexOf(inputText.toString().trim().toLowerCase()) != -1){
                node.style.display = "block";
            } else{
                node.style.display = "none";
            }
        });
        this.setPickListName ();
    }
    setPickListName () {
        let selecedItems = this.getSelectedItems ();
        let selections = '' ;
        if (selecedItems.length < 1) {
            selections = this.comboplaceholder;
        } else if (selecedItems.length > this.maxselected) {
            selections = selecedItems.length + ' Opções selecionadas';
        } else {
            selecedItems.forEach (option => {
                selections += option.value+',';
            });
        }
        this._selectedItems = selections;
    }
    @api
    getSelectedItems () {
        let resArray = new Array ();
        this._mOptions.forEach (function (eachItem) {
            if (eachItem.selected) {
                resArray.push (eachItem);
            }
        });
        return resArray;
    }
    onItemSelected () {
        const evt = new CustomEvent ('itemselected', { detail : this.getSelectedItems ()});
        this.dispatchEvent (evt);
    }


}
