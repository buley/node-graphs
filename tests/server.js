
/* Graphs */

var graphs = require( './../lib/graphs.js' );
graphs.debug();
graphs.connect( 'http://localhost:7474' );

var v1 = Math.floor( Math.random()* 10 );
var v2 = Math.floor( Math.random()* 10 );
var state = {};
state.relationship_seed = v1 + '-' + v2;

var on_error = function( err_req, err_res ) {
	console.log( 'ERROR', err_req, err_res );
};

var create = function( state, callback ) {

	/* Create Node 1 */
	graphs.create( { datatype: 'node', data: { seed: v1 }, on_success: function( req1, res1 ) {
		
		state.node_1 = res1.id;
		state.node_1_seed = v1;

		/* Index Property On Node 1 */
		graphs.create( { datatype: 'index', id: res1.id, index_type: 'node', index: 'NODE_IDX', data: { seed: v1 }, on_success: function( req2, res2 ) {

			/* Create Node 2 */
			graphs.create( { datatype: 'node', data: { seed: v2 }, on_success: function( req3, res3 ) {

				state.node_2 = res3.id;
				state.node_2_seed = v2;
				
				/* Index Property On Node 2 */
				graphs.create( { datatype: 'index', id: res3.id, index_type: 'node', index: 'NODE_IDX', data: { seed: v2 }, on_success: function( req4, res4 ) {
				
					/* Create Relationship Between Node 1 and Node 2 */
					graphs.create( { datatype: 'relationship', to: res3.id, from: res1.id, data: { seed: state.relationship_seed }, name: 'HELLO_WORLD', on_success: function( req5, res5 ) {

						state.relationship = res5.id;
;
						/* Index Property On Relationship */
						graphs.create( { datatype: 'index', id: res5.id, index_type: 'relationship', index: 'RELATIONSHIP_IDX', data: { seed: state.relationship_seed }, on_success: function( req6, res6 ) {

							// Create done
							if ( 'function' === typeof callback ) {
								console.log( 'FINISHED CREATE' );
								callback( state );
							}

						} , on_error: on_error } );

					} , on_error: on_error } );

				} , on_error: on_error } );

			} , on_error: on_error } );

		}, on_error: on_error } );

	}, on_error: on_error } );

};


var update = function( state, callback ) {

	var update_on_error = function( err_req, err_res ) {
		console.log( 'Update error', err_req, err_res );
	};
	var v3 = Math.floor( Math.random() * 100 );
	var v4 = Math.floor( Math.random() * 100 );
	var v5 = Math.floor( Math.random() * 100 );
	var v6 = Math.floor( Math.random() * 100 );
	var v7 = v3 + '-' + v5;
	var v8 = v4 + '-' + v6;
	/* Update Node 1 By Index */
	graphs.update( { datatype: 'index', index_type: 'node', data: { seed: v3 }, index: 'NODE_IDX', key: 'seed', value: state.node_1_seed, on_success: function( req2, res2 ) {
		
	}, on_complete: function( req2, res2 ) { 

		state.node_1_seed = v3;

		/* Update Node 1 By ID */
		graphs.update( { datatype: 'node', id: state.node_1, data: { seed: v4 }, on_success: function( req1, res1 ) {

			state.node_1_seed = v4;

			/* Update Node 2 By Index */
			graphs.update( { datatype: 'index', index_type: 'node', data: { seed: v5 }, index: 'NODE_IDX', key: 'seed', value: state.node_2_seed, on_success: function( req4, res4 ) {

			}, on_complete: function( req4, res4 ) { 
		
				state.node_2_seed = v5;
				
				/* Update Node 2 By ID */

				graphs.update( { datatype: 'node', id: state.node_2, data: { seed: v6 }, on_success: function( req3, res3 ) {
				
					state.node_2_seed = v6;

					/* Update Relationship By Index */
					graphs.update( { datatype: 'index', index_type: 'relationship', data: { seed: v7 }, index: 'RELATIONSHIP_IDX', key: 'seed', value: state.relationship_seed, on_success: function( req6, res6 ) {

					}, on_complete: function( req6, res6 ) {

						state.relationship_seed = v7;

						/* Update Relationship By ID */
						graphs.update( { datatype: 'relationship', id: state.relationship, data: { seed: v8 }, on_success: function( req5, res5 ) {

							state.relationship_seed = v8;


							// Update done
							if ( 'function' === typeof callback ) {
								console.log( 'FINISHED UPDATE' );
								callback( state );
							}

						}, on_error: update_on_error } );
	
					}, on_error: update_on_error } );

				}, on_error: update_on_error } );

			}, on_error: update_on_error } );

		}, on_error: update_on_error } );

	}, on_error: update_on_error } );

};

var read = function( state, callback ) {

	var read_on_error = function( err_req, err_res ) {
		console.log( 'Read error', err_req, err_res );
	};

	/* Get Node 1 By ID */
	graphs.read( { datatype: 'node', id: state.node_1, on_success: function( req1, res1 ) {

		if ( state.node_1_seed !== res1.data.seed ) {
			console.log(  'Node 1 data mismatch', state.node_1_seed, res1.data.seed );
			throw new Error( 'Node 1 data mismatch', state.node_1_seed, res1.data.seed );
		} else {
			console.log( 'Node 1 data test passed' );
		}

		/* Get Node 1 By Index */
		graphs.read( { datatype: 'index', index_type: 'node', index: 'NODE_IDX', key: 'seed', value: state.node_1_seed, on_success: function( req2, res2 ) {
			
			if ( state.node_1_seed !== res2.data.seed ) {
				console.log( 'Node 1 index data mismatch', state.node_1_seed, res2.data.seed );
				throw new Error( 'Node 1 index data mismatch', state.node_1_seed, res2.data.seed );
			} else {
				console.log( 'Node 1 index data test passed' );
			}

		}, on_complete: function( req2, res2 ) { 
			
			/* Get Node 2 By ID */
			graphs.read( { datatype: 'node', id: state.node_2, on_success: function( req3, res3 ) {

				if ( state.node_2_seed !== res3.data.seed ) {
					console.log( 'Node 2 data mismatch', state.node_2_seed, res3.data.seed );
					throw new Error( 'Node 2 data mismatch', state.node_2_seed, res3.data.seed );
				} else {
					console.log( 'Node 2 data test passed' );
				}

				/* Get Node 2 By Index */
				graphs.read( { datatype: 'index', index_type: 'node', index: 'NODE_IDX', key: 'seed', value: state.node_2_seed, on_success: function( req4, res4 ) {

					if ( state.node_2_seed !== res4.data.seed ) {
						console.log( 'Node 2 index data mismatch', state.node_2_seed, res4.data.seed );
						throw new Error( 'Node 2 index data mismatch', state.node_2_seed, res4.data.seed );
					} else {
						console.log( 'Node 2 index data test passed' );
					}

				}, on_complete: function( req4, res4 ) { 

					/* Get Relationship By ID */
					graphs.read( { datatype: 'relationship', id: state.relationship, on_success: function( req5, res5 ) {

						if ( state.relationship_seed !== res5.data.seed ) {
							console.log( 'Relationship data mismatch', state.relationship_seed, res5.data.seed );
							throw new Error( 'Relationship data mismatch', state.relationship_seed, res5.data.seed );
						} else {
							console.log( 'Relationship data test passed' );
						}

						/* Get Relationship By Index */
						graphs.read( { datatype: 'index', index_type: 'relationship', index: 'RELATIONSHIP_IDX', key: 'seed', value: state.relationship_seed, on_success: function( req6, res6 ) {

							if ( state.relationship_seed !== res6.data.seed ) {
								console.log( 'Relationship index data mismatch', state.relationship_seed, res6.data.seed );
								throw new Error( 'Relationship index data mismatch', state.relationship_seed, res6.data.seed );
							} else {
								console.log( 'Relationship index data test passed' );
							}

						}, on_complete: function( req6, res6 ) {

							// Read done
							if ( 'function' === typeof callback ) {
								console.log( 'FINISHED READ' );
								callback( state );
							}

						}, on_error: read_on_error } );
	
					}, on_error: read_on_error } );

				}, on_error: read_on_error } );

			}, on_error: read_on_error } );

		}, on_error: read_on_error } );

	}, on_error: read_on_error } );

};

var destroy = function( state, callback ) {

	var destroy_on_error = function( err_req, err_res ) {
		console.log( 'Destroy test error', err_req, err_res );
	};

	/* Remove Relationship By ID */
	graphs.destroy( { datatype: 'relationship', id: state.relationship, on_success: function( req1, res1 ) {
		
		/* Remove Node 1 By ID */
		graphs.destroy( { datatype: 'node', id: state.node_1, on_success: function( req1, res1 ) {

			/* Remove Node 2 By ID */
			graphs.destroy( { datatype: 'node', id: state.node_2, on_success: function( req1, res1 ) {
		
				// Destroy done
				if ( 'function' === typeof callback ) {
					console.log( 'FINISHED DESTROY' );
					callback( state );
				}

			}, on_error: destroy_on_error } );

		}, on_error: destroy_on_error } );

	}, on_error: destroy_on_error } );
};

/* Test */

var test = function( state ) {
	create( state, function( state ) {
		update( state, function( state ) {
			read( state, function( state ) {
				destroy( state, function( state ) {
					console.log( "TESTS PASSED", state );
				} );
			} );
		} );
	} );
}( state );



/* 
graphs.create( { datatype: 'index', id: 2, index_type: 'node', index: 'NODE_IDX', data: { seed: '3-7' }, on_success: function( req4, res4 ) {
	console.log("MANUAL",res4);
}, on_error: function(req,err){console.log('Err',err);}  }  );
*/
