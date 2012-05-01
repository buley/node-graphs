/* node-graphs */

module.exports = ( function() {

	/* Neo4J Database */

	var Private = {};
	var neo4j = require( 'neo4j' );

	/* Database API */


	Private.database = {};

	Private.database.query = function( req ) {
		Private.log( 'Private.database.query', req );
		var query = req.request.query;
		var index = req.request.index;
		var target = 1, current = 0, results = [];

		var generic_callback = function( err, result ) {
			Private.log( 'Private.database.query > generic_callback', err, result );
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
				own_on_complete( err );
			} else {
				var x = 0, xlen = result.length, xitem;
				target = xlen;
				for ( x = 0; x < xlen; x += 1 ) {
					xitem = result[ x ];
					own_on_success( xitem );
				}
				own_on_complete( result );
			}
		};
		var own_on_success = function( res ) {
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};
		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};
		var own_on_complete = function( res ) {
			if ( 'function' === typeof req.on_complete ) {
				req.on_complete( res );
			}
		};
	
		if ( 'undefined' !== typeof index && null !== index ) {
			if ( 'node' === req.request.index_type ) {
				Private.db.queryNodeIndex( index, query, generic_callback );
			} else if ( 'relationship' === req.request.index_type ) {
				Private.db.queryRelationshipIndex( index, query, generic_callback );
			}
		} else {
			for ( var z in Private.db.prototype ) {
				console.log( "PRIVATE PROTO ", z );
			}
			Private.db.query( generic_callback, query );
		}

	};

	Private.database.node = {};

	/* direction: all, out, in (string)
	 * id: (int)
	 * types: (array)
	 */
	Private.database.node.list = function( req ) {
		Private.log( 'Private.database.node.list', req );
		var direction = req.request.direction
		, id = req.request.id
		, types = req.request.types;

		var generic_callback = function( err, result ) {
			Private.log( 'Private.database.node.list > generic_callback', err, result );
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				own_on_success( result );
			}
		};
		var own_on_success = function( res ) {
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};
		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};
	
		if ( 'all' === direction ) {

			if( 'string' !== typeof types && types.length > 0 ) {
				//all relationships by type
				//http://localhost:7474/db/data/node/1/relationships/all/HELLO_WORLD
				Private.db.listNodeRelationships( generic_callback, id, 'all', types );
			} else {
				//all relationships
				//http://localhost:7474/db/data/node/2/relationships/all
				Private.db.listNodeRelationships( generic_callback, id, 'all' );
			}

		} else if ( 'outgoing' === direction || 'out' === direction ) {

			if( 'string' !== typeof types && types.length > 0 ) {
				//outgoing by type 
				//http://localhost:7474/db/data/node/2/relationships/out/HELLO_WORLD&FOO_BAR
				Private.db.listNodeRelationships( generic_callback, id, 'outgoing', types );
			} else {
				//any outgoing relationships
				//http://localhost:7474/db/data/node/1/relationships/out
				Private.db.listNodeRelationships( generic_callback, id, 'outgoing'  );
			}

		} else if ( 'incoming' === direction || 'in' === direction ) {	

			if( 'string' !== typeof types && types.length > 0 ) {
				//any incoming by type
				//http://localhost:7474/db/data/node/2/relationships/in/HELLO_WORLD&FOO_BAR
				Private.db.listNodeRelationships( generic_callback, id, 'incoming', types );
			} else {
				//incoming relationships
				//http://localhost:7474/db/data/node/2/relationships/in/
				Private.db.listNodeRelationships( generic_callback, id, 'incoming' );
			}

		}

	};


	Private.database.node.create = function( req ) {
		Private.log( 'Private.database.node.create', req );

		var data = req.request.data;
		var generic_callback = function( err, result ) {
			Private.log( 'Private.database.node.create > generic_callback', err, result );
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				Private.log( 'generic callback success > ' + JSON.stringify( { id: node.id, data: node.data, reference: node } ) );
				own_on_success( { id: node.id, data: node.data, reference: node } );
			}
		};
		var own_on_success = function( res ) {
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};
		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};

		var node = Private.db.createNode( data );
		node.save( generic_callback );

	};

	Private.database.node.destroy = function( req ) {

		Private.log( 'Private.database.node.destroy', req );

		var id = req.request.id;
		var force = ( true === req.request.force ) ? req.request.force : false;
		var generic_callback = function( err, result ) {
			Private.log( 'Private.database.node.destroy generic', err, result );
			if ( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				var own_generic_callback = function( err2, result2 ) {
					if ( 'undefined' !== typeof err2 && null !== err2 ) {
						Private.log( 'Private.database.node.destroy > generic_callback() > error', err2 );
						own_on_error( err2 );
					} else {
						own_on_success( result2 );
					}
				};
				var res = result.delete( own_generic_callback, force );
			}
		};

		var own_on_success = function( res ) {
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};

		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};

		Private.db.getNodeById( id, generic_callback );
	};

	Private.database.node.update = function( req ) {

		Private.log( 'Private.database.node.update', req );

		var data = req.request.data;
		var id = req.request.id;
		var reindex = req.request.reindex;
		var reference = req.reference;
		var force = ( true === req.request.force ) ? req.request.force : false;
		var generic_callback = function( err, result ) {
			Private.log( 'Private.database.node.update generic', err, result );
			if ( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				var own_generic_callback = function( err2, result2 ) {
					Private.log( 'Private.database.node.update generic > own_generic_callback()', err2, result2 );
					if ( 'undefined' !== typeof err2 && null !== err2 ) {
						own_on_error( err2 );
					} else {
						own_on_success( { id: result.id, data: result.data, reference: result } );
					}
				};
				result.data = data;
				result.save( own_generic_callback );
			}
		};

		var own_on_success = function( res ) {
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};

		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};
	
		if ( 'undefined' !== typeof reference && null !== reference ) {
			Private.log( 'Private.database.node.update > doing generic_callback()', reference );
			generic_callback( null, reference );
		} else {
			Private.log( 'Private.database.node.update > doing Private.db.getNodeById()', id );
			Private.db.getNodeById( id, generic_callback );
		}

	};

	Private.database.node.read = function( req ) {

		Private.log( 'Private.database.node.read', req );

		var data = req.request.data;
		var id = req.request.id;

		var generic_callback = function( err, result ) {
			Private.log( 'Private.database.node.read generic', err, result );
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				Private.log( 'generic callback success > ' + JSON.stringify( { id: result.id, data: result.data } ) );
				own_on_success( { id: result.id, data: result.data } );
			}
		};

		var own_on_success = function( res ) {
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};

		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};

		Private.db.getNodeById( id, generic_callback );

	};


	Private.database.relationship = {};

	Private.database.relationship.create = function( req ) {

		Private.log( 'Private.database.relationship.create', req );

		var from = req.request.from;
		var to = req.request.to;
		var name = req.request.name;
		var data = req.request.data;

		var generic_callback = function( err, result ) {
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				Private.log( 'generic callback success > ' + JSON.stringify( { id: result.id, data: result.data } ) );
				own_on_success( { id: result.id, data: result.data, start: { id: result.start.id, data: result.start.data }, end: { id: result.end.id, data: result.end.data }, type: result.type } );
			}
		};
		var own_on_success = function( res ) {
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};
		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};
		Private.db.getNodeById( from, function( error, from_node ) {
			if ( null !== error ) {
				own_on_error( from_node );
				return;
			}
			Private.db.getNodeById( to, function( error, to_node ) {
				if ( null !== error ) {
					own_on_error( to_node );
					return;
				}
				from_node.createRelationshipTo( to_node, name, data, generic_callback );
			} );
		} );

	};

	Private.database.relationship.destroy = function( req ) {
		Private.log( 'Private.database.relationship.destroy', req );
		var data = req.request.data;
		var id = req.request.id;
		var generic_callback = function( err, result ) {
			Private.log( 'Private.database.relationship.destroy > generic_callback', err, result );
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				Private.log( 'generic callback success > ' + JSON.stringify( { id: result.id, data: result.data } ) );

				var own_generic_callback = function( err2, result2 ) {
					if( 'undefined' !== typeof err && null !== err ) {
						own_on_error( err );
					} else {
						own_on_success( { id: result.id, data: result.data, start: { id: result.start.id, data: result.start.data }, end: { id: result.end.id, data: result.end.data }, type: result.type } );
					}
				};

				result.delete( own_generic_callback );
			}
		};
		var own_on_success = function( res ) {
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};
		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};

		Private.db.getRelationshipById( id, generic_callback );

	};

	Private.database.relationship.update = function( req ) {
		Private.log( 'Private.database.relationship.update', req );
		var data = req.request.data;
		var id = req.request.id;
		var reference = req.reference || req.request.reference;
		var generic_callback = function( err, result ) {
			Private.log( 'Private.database.relationship.update > generic_callback', err, result );
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				var own_generic_callback = function( err2, result2 ) {
					Private.log( 'Private.database.relationship.update > own_generic_callback()', err2, result2 );
					if( 'undefined' !== typeof err2 && null !== err2 ) {
						own_on_error( err2 );
					} else {
						own_on_success( { id: result.id, data: result.data, start: { id: result.start.id, data: result.start.data }, end: { id: result.end.id, data: result.end.data }, type: result.type, reference: result } );
					}
				};
				result.data = data;
				result.save( own_generic_callback );
			}
		};
		var own_on_success = function( res ) {
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};
		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};
		if ( 'undefined' !== typeof reference && null !== typeof reference ) {
			generic_callback( null, reference );
		} else {
			Private.log( 'Private.db.getRelationshipById', id );
			Private.db.getRelationshipById( id, generic_callback );
		}

	};

	Private.database.relationship.read = function( req ) {
		Private.log( 'Private.database.relationship.read', req );

		var data = req.request.data;
		var id = req.request.id;
		var generic_callback = function( err, result ) {
			Private.log( 'Private.database.relationship.read > generic_callback', err, result );
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				Private.log( 'generic callback success > ' + JSON.stringify( { id: result.id, data: result.data } ) );
				own_on_success( { id: result.id, data: result.data, start: { id: result.start.id, data: result.start.data }, end: { id: result.end.id, data: result.end.data }, type: result.type, reference: result } );
			}
		};
		var own_on_success = function( res ) {
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};
		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};

		Private.db.getRelationshipById( id, generic_callback );

	};

	/* Index */

	Private.database.index = {};

	Private.database.index.create = function( req ) {

		var id = req.request.id;
		var key = req.request.key;
		var value = req.request.value;
		var type = req.request.index_type;
		var index = req.request.index;
		var reference = req.request.reference;
	
		Private.log( 'Private.database.index.create > id, key, value, type, index', id, key, value, type, index );

		var generic_callback = function( err, result ) {
			Private.log( 'Private.database.index.create > generic_callback', err, result );
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {				
				var generic_callback_2 = function( err2, result2 ) {
					Private.log( 'Private.database.index.create > generic_callback_2', err2, result2 );
					if( 'undefined' !== typeof err2 && null !== err2 ) {
						own_on_error( err2 );
					} else {
						var obj = {};
						if ( null !== result ) {
							obj.id = result.id;
							obj.data = result.data;
							if ( type === 'relationship' ) {
								obj.start = result.start.id;
								obj.end = result.end.id;
							}
						}
						Private.log( 'Private.database.index.create > generic_callback_2 > own_on_success()', obj );
						own_on_success( obj );
					}
				};
				Private.log( 'Private.database.index.create > generic_callback > result.index()', typeof result.index, index, key, value );
				result.index( index, key, value, generic_callback_2 );
			}
		};

		var own_on_success = function( res ) {
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};

		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};

		if ( 'undefined' === typeof reference || null === reference ) {
			if ( type === 'relationship' ) {
				Private.db.getRelationshipById( id, generic_callback );
			} else {
				Private.db.getNodeById( id, generic_callback );
			}
		} else {
			generic_callback( null, reference );
		}
	};

	Private.database.index.destroy = function( req ) {
		Private.log( 'Private.database.index.destroy', req );
		
		var index = req.request.index;
		var index_type = req.request.index_type;
		var id = req.request.id;
		var key = req.request.key;
		var value = req.request.value;
		var reference = req.reference || req.request.reference;

		var own_on_success = function( res ) {
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};

		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};

		var generic_callback = function( err, result ) {
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				own_on_success( result );
			}
		};	
		
		Private.log( 'Private.database.index.destroy > doing Private.db.deleteRelationshipEntry', typeof Private.db.deleteRelationshipEntry, index, key, value, id );
		if ( 'relationship' === index_type ) {
			Private.db.deleteRelationshipEntry( index, key, value, id, generic_callback );	
		} else {
			Private.db.deleteNodeEntry( index, key, value, id, generic_callback );	
		}
	};


	Private.database.index.pluck = function( req ) {
		Private.log( 'Private.database.index.destroy', req );
		
		var index = req.request.index;
		var index_type = req.request.index_type;
		var id = req.request.id;
		var key = req.request.key;
		var value = req.request.value;
		var reference = req.reference || req.request.reference;

		var own_on_success = function( res ) {
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};

		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};

		var generic_callback = function( err, result ) {
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				var generic_callback_2 = function( err2, result2 ) {
					if( 'undefined' !== typeof err2 && null !== err2 ) {
						Private.log( 'Private.database.index.destroy > error', err2 );
						own_on_error( err2 );
					} else {
						Private.log( 'Private.database.index.destroy > success', result2 );
						own_on_success( result2 );
					}
				}
				Private.log( 'Private.database.index.destroy > doing result2.delete()', typeof result.delete );
				result.delete( generic_callback_2 );
			}
		};	

		if ( ( 'undefined' === typeof key || 'undefined' === typeof value || 'undefined' === typeof index ) ) {
			if ( 'undefined' !== typeof reference && null !== reference ) {
				generic_callback( null, reference );
			}
		} else {
			if ( 'undefined' !== typeof reference && null !== reference ) {
				generic_callback( null, reference );	
			} else {
				if ( 'relationship' === index_type ) {
					Private.db.getIndexedRelationships( index, key, value, generic_callback );
				} else {
					Private.db.getIndexedNodes( index, key, value, generic_callback );
				}
			}
		}
	};

	Private.database.index.update = function( req ) {

		Private.log( 'Private.database.index.update', req );

		var data = req.request.data;
		var index = req.request.index;
		var key = req.request.key;
		var value = req.request.value;
		var type = req.request.index_type;
		var reindex = req.request.reindex;
		var reference = req.request.reference;
		var prev_key = null;
		var prev_val = null;

		var generic_callback = function( err, result ) {

			Private.log( 'Private.database.index.update > generic_callback() > RESULT', err, result );
			Private.log( 'Private.database.index.update > generic_callback() > PREVIOUS key/value', key, value );

			prev_key = key;
			prev_val = value;

			if( 'undefined' !== typeof err && null !== err ) {

				own_on_error( err );

			} else {

				var target = 1, count = 0;

				var own_generic_callback = function( err2, result2 ) {
					Private.log( 'Private.database.index.update > own_generic_callback', err2, result2 );
				};

				var very_own_on_success = function( res2 ) {
				
					Private.log( 'Private.database.index.update > very_own_on_success()', res2 );

					var id = res2.id; 

					var very_very_own_on_success = function( res3 ) {
						count = count + 1;
						Private.log( 'Private.database.index.update > very_very_own_on_success()', count, target );
						if ( count >= target ) {
							own_on_success( res3 );
						};
					};

					var very_very_own_on_error = function( res3 ) {
						Private.log( 'Private.database.index.update > very_very_own_on_error()', res3 );
						own_on_error( res3 );
					};
					
					if ( false !== reindex ) {
						for ( var attr in data ) {
							if ( data.hasOwnProperty( attr ) ) {

								var vvv_generic_callback = function(err3,res3) {

									Private.log('Private.database.index.update > vvv_generic_callback() > doing Private.database.index.create()' );
									Private.database.index.create( {
										request: {
											index: index
											, id: id
											, index_type: type
											, key: attr
											, value: data[ attr ]
										}
										, on_success: very_very_own_on_success
										, on_error: very_very_own_on_error 
										, reference: res2.reference
									} );

								};

								//vvv_generic_callback();
								Private.log( 'Private.database.index.update > doing Private.database.index.destroy() > PREVIOUS > DESTROYING', prev_key, prev_val );	
								Private.database.index.destroy( {
									request: {
										index: index
										, id: id
										, index_type: type
										, key: prev_key
										, value: prev_val
									}
									, on_success: vvv_generic_callback
									, on_error: very_very_own_on_error
									, reference: res2.reference
								} );
							}
						}
					} else {
						Private.log('Private.database.index.update > doing very_very_own_on_success()',type);
						very_very_own_on_success();
					}
				};

				var very_own_on_error = function(res2) {
					count = count + 1;
					Private.log( 'Private.database.index.update > very_own_on_error', res2 );
				};

				Private.log('Private.database.index.update > ITERATION',result);

				if ( result.length > 0 ) {	
					target = result.length;
					for ( var x = 0; x < result.length; x += 1 ) {
						if ( 'relationship' === type ) {
							Private.log( 'Private.database.index.update > ITERATION > Private.database.relationship.update()', result[ x ] );
							Private.log( 'Private.database.index.update > ITERATION > Private.database.relationship.update() > INDEXED', result[ x ]._data.indexed );
							Private.database.relationship.update( {
								request: { data: data, id: result[ x ].id }
								, on_success: very_own_on_success
								, on_error: very_own_on_error
								, reference: result[ x ]
							} );
						} else {
							Private.log( 'Private.database.index.update > ITERATION > Private.database.node.update()', result[ x ] );
							Private.database.node.update( {
								request: { data: data, id: result[ x ].id }
								, on_success: very_own_on_success
								, on_error: very_own_on_error
								, reference: result[ x ]
							} );
						}
					} 
				} else {
					target = 1;
					own_on_error();
				} 
			}
		};

		var own_on_success = function( res ) {
			Private.log('Private.database.index.update > own_on_success',res);
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};

		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};

		if( ( 'undefined' === typeof key || null === key || 'undefined' === typeof value || null === value ) && 'undefined' !== typeof reference && null !== reference ) {
			var id = reference.id;
			for ( var attr in data ) {
				if ( data.hasOwnProperty( attr ) ) {
					var vvv_generic_callback = function(err3,res3) {
						Private.log('Private.database.index.update > vvv_generic_callback() > doing Private.database.index.create()' );
						Private.database.index.create( {
							request: {
								index: index
								, id: id
								, index_type: type
								, key: attr
								, value: data[ attr ]
							}, on_success: own_on_success
							, on_error: own_on_error 
							, reference: reference
						} );
					};
					Private.log( 'Private.database.index.update > doing Private.database.index.destroy()', ( 'undefined' !== typeof reference ? reference.data : null ) );	
					for ( var attr2 in reference.data ) {
						Private.database.index.destroy( {
							request: {
								index: index
								, id: id
								, index_type: type
								, key: attr2
								, value: reference.data[ attr2 ]
							}
							, on_error: vvv_generic_callback
							, on_success: own_on_error
							, reference: reference
						} );
					}
					vvv_generic_callback();
				}
			}

		} else {
			if ( 'relationship' === type ) {
				Private.log('Private.database.index.update > RELATIONSHIP > Private.db.getIndexedRelationships()', index, key, value );
				Private.db.getIndexedRelationships( index, key, value, generic_callback );
			} else {
				Private.log('Private.database.index.update > NODE > Private.db.getIndexedNodes()', index, key, value );
				Private.db.getIndexedNodes( index, key, value, generic_callback );
			}
		}

	};

	Private.database.index.read = function( req ) {

		Private.log( 'Private.database.index.read', req );
			
		var index = req.request.index;
		var key = req.request.key;
		var value = req.request.value;
		var type = req.request.index_type;
		var target = 0;
		var items = [];
		var count = 0;

		var generic_callback = function( err, result ) {

			Private.log( 'Private.database.index.read > generic_callback', err, result);

			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				target = result.length;
				if ( result.length > 0 ) {

					Private.log( 'Private.database.index.read > generic_callback > looping', count );

					for ( var x = 0; x < result.length; x += 1 ) {

						Private.log( 'Private.database.index.read > generic_callback > looping', x, result[ x ] );
						Private.log( 'Private.database.index.read > generic_callback > looping > type', type );
						Private.log( 'Private.database.index.read > generic_callback > looping > target', target );

						if ( type === 'relationship' ) {
							own_on_success( { id: result[ x ].id, data: result[ x ].data, start: result[ x ].start, end: result[ x ].end, type: result[ x ].type, reference: result[ x ] } );
							items.push( { id: result[ x ].id, data: result[ x ].data, start: result[ x ].start, end: result[ x ].end, type: result[ x ].type, reference: result[ x ] } );
						} else {
							own_on_success( { id: result[ x ].id, data: result[ x ].data, reference: result[ x ] } );
							items.push( { id: result[ x ].id, data: result[ x ].data, reference: result[ x ] } );
						}
					}
				} else {
					own_on_success( null );
				}

			}
		};

		var own_on_success = function( res ) {
			Private.log( 'Private.database.index.read > own_on_success > count, target', count, target );
			count += 1;
			items.push( res );
			if ( count >= target ) {
				Private.log( 'Private.database.index.read > own_on_success > doing own_on_complete()', items );
				own_on_complete( items );
			}
		};

		var own_on_error = function( res ) {
			Private.log( 'Private.database.index.read > own_on_error()', typeof req.on_error );
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};

		var own_on_complete = function( res ) {
			Private.log( 'Private.database.index.read > own_on_complete()', res );
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};

		if ( type === 'relationship' ) {
			Private.log( 'Doing Private.db.getIndexedRelationships', index, key, value );
			Private.db.getIndexedRelationships( index, key, value, generic_callback );
		} else {
			Private.log( 'Doing Private.db.getIndexedNodes', index, key, value );
			Private.db.getIndexedNodes( index, key, value, generic_callback );
		}

	};

	/* Queries */

	Private.query = function( req ) {

		Private.log( 'Private.query', req );

		var own_on_success
		, own_on_complete
		, own_on_error
		, a = 0, alen = 0, aitem;

		var own_on_success = function( res ) {

			if ( 'function' === typeof req.on_success ) {
				req.on_success( req, res );
			}

			own_on_complete( res );

		};

		var own_on_complete = function( res ) {

			if ( 'function' === typeof req.on_complete ) {
				req.on_complete( req, res );
			}

		};

		var own_on_error = function( res ) {

			if ( 'function' === typeof req.on_error ) {
				req.on_error( req, res );
			}

			own_on_complete( res );

		};

		if ( Array.isArray( req.data ) && ( 'undefined' === typeof key || 'undefined' === typeof value || null === key || null === value ) ) {

			var a = 0, alen = request.data.length, aitem;
			target = alen;

			for( a = 0; a < alen; a += 1 ) {
				Private.database.query( { request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {

			Private.database.query( { request: req, on_success: own_on_success, on_error: own_on_error } );

		}
	
		return true;

	};

	/* Node */

	Private.node = Private.node || {};
	Private.node.validate = function( req ) {

		Private.log( 'Private.node.validate validation', req );

		var own_on_success = function( res ) {
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};

		var own_on_complete = function( res ) {
			if ( 'function' === typeof req.on_complete ) {
				req.on_complete( res );
			}
		};

		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};

		return true;

	};

	Private.node.create = function( req ) {

		Private.log( 'Private.node.create', req );

		var target = 1
		, current = 0
		, results = []
		, own_on_success
		, own_on_complete
		, own_on_error
		, a = 0, alen = 0, aitem;

		var own_on_success = function( res ) {

			current += 1;

			if ( 'function' === typeof req.on_success ) {
				req.on_success( req, res, current );
			}

			results.push( res );

			if ( current >= target ) {
				own_on_complete( results, current );
			}

		};

		var own_on_complete = function( res, count ) {

			if ( 'function' === typeof req.on_complete ) {
				req.on_complete( req, results, count );
			}

		};

		var own_on_error = function( res ) {

			current += 1;

			if ( 'function' === typeof req.on_error ) {
				req.on_error( req, res, current );
			}

			results.push( res );

			if ( current >= target ) {
				own_on_complete( res, target );
			}

		};

		if ( Array.isArray( req.data ) && ( 'undefined' === typeof key || 'undefined' === typeof value || null === key || null === value ) ) {

			var a = 0, alen = request.data.length, aitem;
			target = alen;

			for( a = 0; a < alen; a += 1 ) {
				Private.database.node.create( { request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {

			Private.database.node.create( { request: req, on_success: own_on_success, on_error: own_on_error } );

		}
	
		return true;

	};

	Private.node.destroy = function( req ) {

		Private.log( 'Private.node.destroy', req );

		var target = 1
		, current = 0
		, results = []
		, own_on_success
		, own_on_complete
		, own_on_error
		, a = 0, alen = 0, aitem;

		var own_on_success = function( res ) {

			current += 1;

			if ( 'function' === typeof req.on_success ) {
				req.on_success( req, res, current );
			}

			results.push( res );

			if ( current >= target ) {
				own_on_complete( results, current );
			}

		};

		var own_on_complete = function( res, count ) {

			if ( 'function' === typeof req.on_complete ) {
				req.on_complete( req, results, count );
			}

		};

		var own_on_error = function( res ) {

			current += 1;

			if ( 'function' === typeof req.on_error ) {
				req.on_error( req, res, current );
			}

			results.push( res );

			if ( current >= target ) {
				own_on_complete( res, target );
			}

		};

		if ( Array.isArray( req.data ) && ( 'undefined' === typeof key || 'undefined' === typeof value || null === key || null === value ) ) {
			var a = 0, alen = req.data.length, aitem;
			target = alen;
			for( a = 0; a < alen; a += 1 ) {
				Private.database.node.destroy( { request: req, on_success: own_on_success, on_error: own_on_error } );
			}
		} else {
			Private.database.node.destroy( { request: req, on_success: own_on_success, on_error: own_on_error } );
		}

		return true;

	};

	Private.node.update = function( req ) {

		Private.log( 'Private.node.update', req );

		var target = 0
		, current = 0
		, results = []
		, own_on_success
		, own_on_complete
		, own_on_error
		, a = 0, alen = 0, aitem;

		var own_on_success = function( res ) {
			current += 1;
			if ( 'function' === typeof req.on_success ) {
				req.on_success( req, res, current );
			}
			results.push( res );
			if ( current >= target ) {
				own_on_complete( results, current );
			}
		};

		var own_on_complete = function( res, count ) {
			Private.log( 'Private.node.update > own_on_complete()', res, count );
			if( true === req.reindex ) {	
				var x = 0, xlen = res.length, xitem;
				for( x = 0; x < xlen; x += 1 ) {
					xitem = res[ x ];
					Private.log( 'Private.node.update > own_on_complete() > reindex', req );
					var very_own_on_success = function( err3, res3 ) {
						Private.log( 'Private.node.update > own_on_complete() > reindex > very_own_on_success()', req );
						if ( 'function' === typeof req.on_complete ) {
							req.on_complete( req, res );
						}				
					};
					req.reindex = false;
					req.index_type = 'node';
					req.reference = xitem.reference;
					Private.database.index.update( { request: req, on_success: very_own_on_success, on_error: own_on_error } );
				}
			} else {
				if ( 'function' === typeof req.on_complete ) {
					req.on_complete( req, results, count );
				}
			}
		};

		var own_on_error = function( res ) {
			current += 1;
			if ( 'function' === typeof req.on_error ) {
				req.on_error( req, res, current );
			}
			results.push( res );
			if ( current >= target ) {
				own_on_complete( res, target );
			}
		};

		if ( Array.isArray( req.data ) && ( 'undefined' === typeof key || 'undefined' === typeof value || null === key || null === value ) ) {
			var a = 0, alen = request.data.length, aitem;
			target = alen;
			for( a = 0; a < alen; a += 1 ) {
				Private.database.node.update( { request: req, on_success: own_on_success, on_error: own_on_error } );
			}
		} else {
			Private.database.node.update( { request: req, on_success: own_on_success, on_error: own_on_error } );
		}

		return true;

	};

	Private.node.read = function( req ) {

		Private.log( 'Private.node.read', req );

		var target = 0
		, current = 0
		, results = []
		, own_on_success
		, own_on_complete
		, own_on_error
		, a = 0, alen = 0, aitem;

		var own_on_success = function( res ) {

			current += 1;

			if ( 'function' === typeof req.on_success ) {
				req.on_success( req, res, current );
			}

			results.push( res );

			if ( current >= target ) {
				own_on_complete( results, current );
			}

		};

		var own_on_complete = function( res, count ) {

			if ( 'function' === typeof req.on_complete ) {
				req.on_complete( req, results, count );
			}

		};

		var own_on_error = function( res ) {

			current += 1;

			if ( 'function' === typeof req.on_error ) {
				req.on_error( req, res, current );
			}

			results.push( res );

			if ( current >= target ) {
				own_on_complete( res, target );
			}

		};

		if ( Array.isArray( req.data ) && ( 'undefined' === typeof key || 'undefined' === typeof value || null === key || null === value ) ) {

			var a = 0, alen = request.data.length, aitem;
			target = alen;
			for( a = 0; a < alen; a += 1 ) {
				Private.database.node.read( { request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {

			Private.database.node.read( { request: req, on_success: own_on_success, on_error: own_on_error } );

		}

		return true;

	};

	Private.relationship = Private.relationship || {};

	Private.relationship.validate = function( req ) {
		Private.log( 'Private.relationship.validate validation', req );
		var own_on_success = function( res ) {
			if ( 'function' === typeof req.on_success ) {
				req.on_success( req, res );
			}
		};
		var own_on_complete = function( res ) {
			if ( 'function' === typeof req.on_complete ) {
				req.on_complete( req, res );
			}
		};
		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( req, res );
			}
		};
		return true;
	};

	Private.relationship.create = function( req ) {

		Private.log( 'Private.relationship.create', req );

		var target = 0
		, current = 0
		, results = []
		, own_on_success
		, own_on_complete
		, own_on_error
		, a = 0, alen = 0, aitem;

		var own_on_success = function( res ) {

			current += 1;

			if ( 'function' === typeof req.on_success ) {
				req.on_success( req, res, current );
			}

			results.push( res );

			if ( current >= target ) {
				own_on_complete( results, current );
			}

		};

		var own_on_complete = function( res, count ) {

			if ( 'function' === typeof req.on_complete ) {
				req.on_complete( req, results, count );
			}

		};

		var own_on_error = function( res ) {

			current += 1;

			if ( 'function' === typeof req.on_error ) {
				req.on_error( req, res, current );
			}

			results.push( res );

			if ( current >= target ) {
				own_on_complete( res, target );
			}

		};

		if ( Array.isArray( req.data ) && ( 'undefined' === typeof key || 'undefined' === typeof value || null === key || null === value ) ) {

			var a = 0, alen = request.data.length, aitem;
			target = alen;

			for( a = 0; a < alen; a += 1 ) {
				Private.database.relationship.create( { request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {
			Private.database.relationship.create( { request: req, on_success: own_on_success, on_error: own_on_error } );

		}
	
		return true;

	};

	Private.relationship.destroy = function( req ) {

		Private.log( 'Private.relationship.destroy', req );

		var target = 0
		, current = 0
		, results = []
		, own_on_success
		, own_on_complete
		, own_on_error
		, a = 0, alen = 0, aitem;

		var own_on_success = function( res ) {

			current += 1;

			if ( 'function' === typeof req.on_success ) {
				req.on_success( req, res, current );
			}

			results.push( res );

			if ( current >= target ) {
				own_on_complete( results, current );
			}

		};

		var own_on_complete = function( res, count ) {

			if ( 'function' === typeof req.on_complete ) {
				req.on_complete( req, results, count );
			}

		};

		var own_on_error = function( res ) {

			current += 1;

			if ( 'function' === typeof req.on_error ) {
				req.on_error( req, res, current );
			}

			results.push( res );

			if ( current >= target ) {
				own_on_complete( res, target );
			}

		};

		if ( Array.isArray( req.data ) && ( 'undefined' === typeof key || 'undefined' === typeof value || null === key || null === value ) ) {

			var a = 0, alen = request.data.length, aitem;
			target = alen;

			for( a = 0; a < alen; a += 1 ) {
				Private.database.relationship.destroy( { request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {

			Private.database.relationship.destroy( { request: req, on_success: own_on_success, on_error: own_on_error } );

		}

		return true;

	};

	Private.relationship.update = function( req ) {

		Private.log( 'Private.relationship.update', req );

		var target = 0
		, current = 0
		, results = []
		, own_on_success
		, own_on_complete
		, own_on_error
		, a = 0, alen = 0, aitem;

		var own_on_success = function( res ) {
			current += 1;
			if ( 'function' === typeof req.on_success ) {
				req.on_success( req, res, current );
			}
			results.push( res );
			if ( current >= target ) {
				own_on_complete( results, current );
			}
		};

		var own_on_complete = function( res, count ) {
			Private.log( 'Private.relationship.update > own_on_complete()', res, count );
			if( true === req.reindex ) {	
				var x = 0, xlen = res.length, xitem;
				for( x = 0; x < xlen; x += 1 ) {
					xitem = res[ x ];
					Private.log( 'Private.relationship.update > own_on_complete() > reindex', req );
					var very_own_on_success = function( err3, res3 ) {
						Private.log( 'Private.relationship.update > own_on_complete() > reindex > very_own_on_success()', req );
						if ( 'function' === typeof req.on_complete ) {
							req.on_complete( req, res );
						}				
					};
					req.reindex = false;
					req.index_type = 'relationship';
					req.reference = xitem.reference;
					Private.database.index.update( { request: req, on_success: very_own_on_success, on_error: own_on_error } );
				}
			} else {
				if ( 'function' === typeof req.on_complete ) {
					req.on_complete( req, results, count );
				}
			}
		};

		var own_on_error = function( res ) {
			current += 1;
			if ( 'function' === typeof req.on_error ) {
				req.on_error( req, res, current );
			}
			results.push( res );
			if ( current >= target ) {
				own_on_complete( res, target );
			}
		};

		if ( Array.isArray( req.data ) && ( 'undefined' === typeof key || 'undefined' === typeof value || null === key || null === value ) ) {
			var a = 0, alen = request.data.length, aitem;
			target = alen;
			for( a = 0; a < alen; a += 1 ) {
				Private.database.relationship.update( { request: req, on_success: own_on_success, on_error: own_on_error } );
			}
		} else {
			Private.database.relationship.update( { request: req, on_success: own_on_success, on_error: own_on_error } );
		}

		return true;

	};



	Private.relationship.read = function( req ) {

		Private.log( 'Private.relationship.read', req );

		var target = 0
		, current = 0
		, results = []
		, own_on_success
		, own_on_complete
		, own_on_error
		, a = 0, alen = 0, aitem;

		var own_on_success = function( res ) {

			current += 1;

			if ( 'function' === typeof req.on_success ) {
				req.on_success( req, res, current );
			}

			results.push( res );

			if ( current >= target ) {
				own_on_complete( results, current );
			}

		};

		var own_on_complete = function( res, count ) {

			if ( 'function' === typeof req.on_complete ) {
				req.on_complete( req, results, count );
			}

		};

		var own_on_error = function( res ) {

			current += 1;

			if ( 'function' === typeof req.on_error ) {
				req.on_error( req, res, current );
			}

			results.push( res );

			if ( current >= target ) {
				own_on_complete( res, target );
			}

		};

		if ( Array.isArray( req.data ) && ( 'undefined' === typeof key || 'undefined' === typeof value || null === key || null === value ) ) {

			var a = 0, alen = request.data.length, aitem;
			target = alen;

			for( a = 0; a < alen; a += 1 ) {
				Private.database.relationship.read( { request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {

			Private.database.relationship.read( { request: req, on_success: own_on_success, on_error: own_on_error } );

		}

		return true;

	};

	/* Index */

	Private.index = Private.index || {};
	Private.index.validate = function( req ) {

		Private.log( 'Private.index.validate validation', req );

		var own_on_success = function( res ) {
			if ( 'function' === typeof req.on_success ) {
				req.on_success( req, res );
			}
		};

		var own_on_complete = function( res ) {
			if ( 'function' === typeof req.on_complete ) {
				req.on_complete( req, res );
			}
		};

		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( req, res );
			}
		};

		return true;

	};

	Private.index.create = function( req ) {

			Private.log( 'Private.index.create', req );

			var target = 1
			, current = 0
			, results = []
			, own_on_success
			, own_on_complete
			, own_on_error
			, a = 0, alen = 0, aitem;

			var own_on_success = function( res ) {

				current += 1;

				if ( 'function' === typeof req.on_success ) {
					req.on_success( req, res, current );
				}

				results.push( res );

				if ( current >= target ) {
					own_on_complete( results, current );
				}

			};

			var own_on_complete = function( res, count ) {

				if ( 'function' === typeof req.on_complete ) {
					req.on_complete( req, results, count );
				}

			};

			var own_on_error = function( res ) {

				current += 1;

				if ( 'function' === typeof req.on_error ) {
					req.on_error( req, res, current );
				}

				results.push( res );

				if ( current >= target ) {
					own_on_complete( res, target );
				}

			};

			if ( Array.isArray( req.data ) && ( 'undefined' === typeof key || 'undefined' === typeof value || null === key || null === value ) ) {

				var a = 0, alen = request.data.length, aitem;
				target = alen;

				for( a = 0; a < alen; a += 1 ) {
					Private.database.index.create( { request: req, on_success: own_on_success, on_error: own_on_error } );
				}

			} else {

				Private.database.index.create( { request: req, on_success: own_on_success, on_error: own_on_error } );

			}
		
			return true;

	};

	Private.index.destroy = function( req ) {

		Private.log( 'Private.index.destroy', req );

		var target = 0
		, current = 0
		, results = []
		, own_on_success
		, own_on_complete
		, own_on_error
		, a = 0, alen = 0, aitem;

		var own_on_success = function( res ) {

			current += 1;

			if ( 'function' === typeof req.on_success ) {
				req.on_success( req, res, current );
			}

			results.push( res );

			if ( current >= target ) {
				own_on_complete( results, current );
			}

		};

		var own_on_complete = function( res, count ) {

			if ( 'function' === typeof req.on_complete ) {
				req.on_complete( req, results, count );
			}

		};

		var own_on_error = function( res ) {

			current += 1;

			if ( 'function' === typeof req.on_error ) {
				req.on_error( req, res, current );
			}

			results.push( res );

			if ( current >= target ) {
				own_on_complete( res, target );
			}

		};

		if ( Array.isArray( req.data ) && ( 'undefined' === typeof key || 'undefined' === typeof value || null === key || null === value ) ) {

			var a = 0, alen = request.data.length, aitem;
			target = alen;

			for( a = 0; a < alen; a += 1 ) {
				Private.database.index.destroy( { request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {

			Private.database.index.destroy( { request: req, on_success: own_on_success, on_error: own_on_error } );

		}

		return true;

	};

	/* index.update finds a node or relationship given an index and value, then
	 * 1) updates the node or relationship then 2) updates the index to reflect that new value */
	Private.index.update = function( req ) {

		Private.log( 'Private.index.update', req );

		var target = 1
		, current = 0
		, results = []
		, original = JSON.parse( JSON.stringify( req.data ) ) 
		, own_on_success
		, own_on_complete
		, own_on_error
		, a = 0, alen = 0, aitem;

		var own_on_success = function( res ) {
			Private.log( 'Private.index.update > own_on_success()', res );
			current += 1;
			if ( 'function' === typeof req.on_success ) {
				req.on_success( req, res, current );
			}
			results.push( res );
			Private.log( 'Private.index.update > own_on_success() > target, current', target, current );
			if ( current >= target ) {
				own_on_complete( results, current );
			}
		};

		var own_on_complete = function( res, count ) {
			if ( 'function' === typeof req.on_complete ) {
				req.on_complete( req, results, count );
			}
		};

		var own_on_error = function( res ) {
			current += 1;
			if ( 'function' === typeof req.on_error ) {
				req.on_error( req, res, current );
			}
			results.push( res );
			if ( current >= target ) {
				own_on_complete( res, target );
			}
		};

		var idx_callback = function( req1, res1 ) {

			Private.log( 'Private.index.update > idx_callback() > req1, res1', req1, res1  );
			var reqobj = {};
			
			for ( var attr2 in req ) {
				if ( req.hasOwnProperty( attr2 ) ) {
					if ( 'reindex' !== attr2 && 'data' !== attr2 ) {
						Private.log( 'Private.index.update > idx_callback() > looping', reqobj, attr2 );
						reqobj[ attr2 ] = req[ attr2 ];
					}
				}
			}
			
			reqobj.data = original;
			Private.log( 'Private.index.update > idx_callback() > pre-flight > req.reindex, typeof own_on_success and own_on_error', req.reindex, typeof own_on_success, typeof own_on_error );
			reqobj.on_success = own_on_success;
			reqobj.on_error = own_on_error;	
			reqobj.reindex = false;

			var first_callback = function() {
				Private.log( 'Private.index.update > idx_callback() > doing Private.database.index.update() > first_callback()', reqobj );
				Private.database.index.update( { request: reqobj, on_success: own_on_success, on_error: own_on_error, reference: req1.reference } );
			};

			if ( true === req.reindex ) {
				Private.log( 'Private.index.update > idx_callback() > doing Private.database.index.destroy()' );
				Private.database.index.destroy( {
					request: {
						index: req.index
						, id: req1.id
						, index_type: req.index_type
						, key: req.key
						, value: req.value
					}
					, on_success: first_callback
					, on_error: own_on_error
					, reference: ( ( 'undefined' === typeof res1 ) ? null : res1.reference )
				} );
			} else {
				own_on_success();
			}

		};

		var lookup_callback = function( err0, res0 ) {
			Private.log( 'Private.index.update > Private.database.node.update() > lookup_callback()', res0  );
			if ( null === res0 || 'undefined' === typeof res0 ) {
				own_on_error( err0 );
			} else {

				if ( 'relationship' === req.index_type ) {

					Private.log( 'Private.index.update > doing Private.database.relationship.update()', res0  );

					Private.database.relationship.update( { request: req, on_success: idx_callback, on_error: own_on_error, reference: res0 } );

				} else {

					Private.log( 'Private.index.update > doing Private.database.node.update()', res0  );

					Private.database.node.update( { request: req, on_success: idx_callback, on_error: own_on_error, reference: res0 } );

				}
			}
		};

		Private.log( 'Private.index.update > doing Private.index.read()', req  );

		var reqobj = {};
		for ( var attr2 in req ) {
			if ( req.hasOwnProperty( attr2 ) ) {
				if ( 'data' !== attr2 ) {
					reqobj[ attr2 ] = req[ attr2 ];
				}
			}
		}

		var very_own_on_complete = function( err3, res3 ) {
			Private.log( 'Private.index.update > very_own_on_complete()', err3, res3  );
			var x = 0, xlen = res3.length, xitem;
			for( x = 0; x < xlen; x += 1 ) {
				xitem = res3[ x ];
				var y = 0, ylen = xitem.length, yitem;
				Private.log( 'Private.index.update > very_own_on_complete() > xitem', xitem  );
				for( y = 0; y < xlen; y += 1 ) {
					yitem = xitem[ y ];
					/* for each of the nodes found by index, kick off the process */
					Private.log( 'Private.index.update > very_own_on_complete() > yitem', yitem );
					if ( null !== yitem ) {
						lookup_callback( null, yitem.reference );
					}
				}
			}
		};

		Private.index.read( reqobj );
		reqobj.on_complete = very_own_on_complete;
		reqobj.on_success = own_on_success;
		reqobj.on_error = own_on_error;
		return true;

	};

	Private.index.read = function( req ) {

		Private.log( 'Private.index.read', req );

		var target = 0
		, current = 0
		, key = req.key
		, value = req.value
		, index = req.index
		, index_type = req.index_type
		, current = 0
		, results = []
		, own_on_success
		, own_on_complete
		, own_on_error
		, a = 0, alen = 0, aitem;

		var own_on_success = function( res ) {
			Private.log( 'Private.index.read > own_on_success()', res );
			current += 1;
			results.push( res );
			Private.log( 'Private.index.read > own_on_success() > current, target', current, target );
			if ( current >= target ) {
				Private.log( 'Private.index.read > doing own_on_complete()', results, current );
				own_on_complete( results, current );
			}
		};

		var own_on_complete = function( res, count ) {
			if ( 'function' === typeof req.on_complete ) {
				Private.log( 'Private.index.read > doing req.on_complete()', req, results, count );
				req.on_complete( req, results, count );
			}
		};

		var own_on_error = function( res ) {
			current += 1;
			if ( 'function' === typeof req.on_error ) {
				Private.log( 'Private.index.read > doing req.on_error()', req );
				req.on_error( req, res, current );
			}
			results.push( res );
			if ( current >= target ) {
				Private.log( 'Private.index.read > doing own_on_complete()', req );
				own_on_complete( res, target );
			}
		};

		if ( ( 'undefined' !== typeof req.data && null !== req.data ) && ( 'undefined' === typeof key || 'undefined' === typeof value || null === key || null === value ) ) {
			var a = 0, alen = request.data.length, aitem;
			target = alen;
			for( var attr in req.data ) {
				target += 1;
				var val = req.data[ attr ];
				var reqobj = {};
				for ( var attr2 in req ) {
					if ( req.hasOwnProperty( attr2 ) ) {
						if ( 'data' !== attr2 ) {
							reqobj[ attr2 ] = req[ attr2 ];
						}
					}
				}
				reqobj.key = attr;
				reqobj.value = req.data[ attr ];
				reqobj.index = index;
				reqobj.index_type = index_type;
				Private.log( 'Private.index.read > doing Private.database.index.read()', req );
				Private.database.index.read( { request: reqobj, on_success: own_on_success, on_error: own_on_error } );
			}
		} else {
			var reqobj = {};
			target += 1;
			for ( var attr2 in req ) {
				if ( req.hasOwnProperty( attr2 ) ) {
					if ( 'data' !== attr2 ) {
						reqobj[ attr2 ] = req[ attr2 ];
					}
				}
			}
			reqobj.index = index;
			reqobj.index_type = index_type;
			reqobj.key = key;
			reqobj.value = value;
			Private.log( 'Private.index.read > doing Private.database.index.read()', req );
			Private.database.index.read( { request: reqobj, on_success: own_on_success, on_error: own_on_error } );
		}

		return true;

	};


	Private.log = function() {
		if ( true === Private.debug ) {
			console.log( arguments );
		}
	};

	Private.connected = false;

	var Public = function() {	
		Private.log( 'Public > node-graphs startup' );
	};

	Public.prototype.debug = function( a ) {
		if ( 'undefined' === typeof a || null === a ) {
			Private.debug = ( true === Private.debug ) ? false : true;
		} else {
			Private.debug = ( true === a ) ? true : false;
		}
	};

	Public.prototype.list = function( req ) {
		Private.log( 'Public.prototype.list', req );
		if ( true !== Private.connected ) this.connect();
		var datatype = req.type;
		delete req.type;
		if ( 'node' === datatype ) {
			Private.node.list( req );
		} else if ( 'relationship' === datatype ) {
			Private.relationship.list( req );
		} else if ( 'index' === datatype ) {
			Private.index.list( req );
		}
	};

	Public.prototype.connect = function( addy ) {
		if ( true === Private.connected ) {
			return;
		}
		if ( 'undefined' === typeof addy || null === addy ) {
			addy = 'http://localhost:7474';
		}
		Private.db = new neo4j.GraphDatabase( addy );
		Private.connected = true;
	};

	Public.prototype.query = function( req ) {
		Private.log( 'Public.prototype.query', req );
		if ( true !== Private.connected ) this.connect();
		Private.query( req );
	};

	Public.prototype.create = function( req ) {
		Private.log( 'Public.prototype.create', req );
		if ( true !== Private.connected ) this.connect();
		var datatype = req.datatype;
		delete req.datatype;
		if ( 'node' === datatype ) {
			Private.node.create( req );
		} else if ( 'relationship' === datatype ) {
			Private.relationship.create( req );
		} else if ( 'index' === datatype ) {
			Private.index.create( req );
		}
	};

	Public.prototype.read = function( req ) {
		Private.log( 'Public.prototype.read', req );
		if ( true !== Private.connected ) this.connect();
		var datatype = req.datatype;
		delete req.datatype;
		if ( 'node' === datatype ) {
			Private.node.read( req );
		} else if ( 'relationship' === datatype ) {
			Private.relationship.read( req );
		} else if ( 'index' === datatype ) {
			Private.index.read( req );
		}
	};

	Public.prototype.update = function( req ) {
		Private.log( 'Public.prototype.update', req );
		if ( true !== Private.connected ) this.connect();
		var datatype = req.datatype;
		delete req.datatype;
		if ( 'node' === datatype ) {
			Private.node.update( req );
		} else if ( 'relationship' === datatype ) {
			Private.relationship.update( req );
		} else if ( 'index' === datatype ) {
			Private.index.update( req );
		}
	};

	Public.prototype.destroy = function( req ) {
		Private.log( 'Public.prototype.destroy', req );
		if ( true !== Private.connected ) this.connect();
		var datatype = req.datatype;
		delete req.datatype;
		if ( 'node' === datatype ) {
			Private.log('Calling Private.node.destroy via Public.prototype.destroy',req);
			Private.node.destroy( req );
		} else if ( 'relationship' === datatype ) {
			Private.relationship.destroy( req );
		} else if ( 'index' === datatype ) {
			Private.index.destroy( req );
		}
	};

	return new Public();

} )(); 

