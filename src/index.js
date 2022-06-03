import {NearContract, NearBindgen, call, view, near} from 'near-sdk-js'

@NearBindgen
class MyContract extends NearContract {
    constructor() {
        //execute the NEAR Contract's constructor
        super()
    }

    /*
       Method to change the state of the contract
    */
    @call
    changeMethod() {
        /*
            Fill this in
        */
    }

    /*
        Method to view the state of the contract
    */
    @view
    viewMethod() {
        /*
            Fill this in
        */
    }
}