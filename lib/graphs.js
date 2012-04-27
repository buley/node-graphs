/* node-graphs */

module.exports = ( function() {

	/* Neo4J Database */

	var Private = {};
	var neo4j = require( 'neo4j' );

	/* Database API */

	Private.database = {};

	Private.database.node = {};

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

		var data = req.request.data;
		var id = req.request.id;
		var force = ( true === req.request.force ) ? req.request.force : false;
		var generic_callback = function( err, result ) {
			Private.log( 'Private.database.node.destroy generic', err, result );
			if ( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				var own_generic_callback = function( err2, result2 ) {
					if ( 'undefined' !== typeof err2 && null !== err2 ) {
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
		var node = req.request.node;
		var force = ( true === req.request.force ) ? req.request.force : false;
		var generic_callback = function( err, result ) {
			Private.log( 'Private.database.node.update generic', err, result );
			if ( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				var own_generic_callback = function( err2, result2 ) {
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
	
		if ( 'undefined' === typeof node || null === typeof node ) {
			Private.db.getNodeById( id, generic_callback );
		} else {
			generic_callback( null, node );
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
		var generic_callback = function( err, result ) {
			Private.log( 'Private.database.relationship.update > generic_callback', err, result );
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				Private.log( 'generic callback success > ' + JSON.stringify( { id: result.id, data: result.data, reference: result } ) );

				var own_generic_callback = function( err2, result2 ) {
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
		Private.log( 'Private.db.getRelationshipById', id );
		Private.db.getRelationshipById( id, generic_callback );

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
				Private.log( 'Private.database.index.create > generic_callback > result.index()', index, key, value );
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
		var id = req.request.id;
		var key = req.request.key;
		var value = req.request.value;
		var reference = req.request.reference;

		var generic_callback = function( err, result ) {
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				var generic_callback_2 = function( err2, result2 ) {
					if( 'undefined' !== typeof err && null !== err ) {
						own_on_error( err2 );
					} else {
						own_on_success( result2 );
					}
				}
				result2.delete( generic_callback_2 );
			}
		};	
		if ( 'undefined' === typeof reference || null === reference ) {
			generic_callback( null, reference );
		} else {
			Private.db.getIndexedNodes( index, key, value, generic_callback );
		}
	};

	Private.database.index.update = function( req ) {

		Private.log( 'Private.database.index.update', req );

		var index = req.request.index;
		var key = req.request.key;
		var data = req.request.data;
		var value = req.request.value;
		var type = req.request.index_type;
		var reindex = req.request.reindex;

		var generic_callback = function( err, result ) {

			if( 'undefined' !== typeof err && null !== err ) {

				own_on_error( err );

			} else {

				var target = 1, count = 0;

				var own_generic_callback = function( err2, result2 ) {
					Private.log( 'Private.database.index.update > own_generic_callback', err2, result2 );
				};

				var very_own_on_success = function( res2 ) {

					Private.log( 'Private.database.index.update > very_own_on_success', res2 );
					var id = res2.id; 

					var very_very_own_on_success = function( res3 ) {
						count = count + 1;
						console.log( 'Private.database.index.update > very_very_own_on_success', count );
						if ( count >= target ) {
							console.log( 'Private.database.index.update > very_very_own_on_success > own_on_success()', res3 );
							own_on_success( res3 );
						}	
					};

					var very_very_own_on_error = function( res3 ) {
						Private.log( 'Private.database.index.update > very_very_own_on_error', res3 );
						if ( count >= target ) {
							own_on_error( res3 );
						}	
					};

					if ( true === reindex ) {
						//TODO: Use this?
						var del_on_succes = function() {
								if ( type === 'relationship' ) {
									Private.log( "DOING Private.db.deleteRelationshipEntry()", index,key,value,id);
									Private.db.deleteRelationshipEntry( index, key, value, id, function(err3, res3) {
										//del_callback(err3, res3);
									} );
								} else {
									Private.db.deleteNodeEntry( index, key, value, id, function(err3, res3) {
										//del_callback( null, null );
									} );
								} 
						};
						for ( var attr in data ) {
							if ( data.hasOwnProperty( attr ) ) {
								console.log('Private.database.index.update > doing Private.database.index.create()' );
								Private.database.index.create( {
									request: {
										index: index
										, id: id
										, index_type: type
										, key: attr
										, value: data[ attr ]
									}, on_success: very_very_own_on_success
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
							Private.database.relationship.update( {
								request: { data: data, id: result[ x ].id }
								, on_success: very_own_on_success
								, on_error: very_own_on_error
								, reference: result[ x ]
							} );
						} else {
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
			Private.log('Private.database.index.update > own_on_success',type);
			if ( 'function' === typeof req.on_success ) {
				req.on_success( res );
			}
		};

		var own_on_error = function( res ) {
			if ( 'function' === typeof req.on_error ) {
				req.on_error( res );
			}
		};

		if ( 'relationship' === type ) {
			Private.log('Private.database.index.update > RELATIONSHIP',type);
			Private.db.getIndexedRelationships( index, key, value, generic_callback );
		} else {
			Private.db.getIndexedNodes( index, key, value, generic_callback );
		}

	};

	Private.database.index.read = function( req ) {

		Private.log( 'Private.database.index.read', req );
		
		var index = req.request.index;
		var key = req.request.key;
		var value = req.request.value;
		var type = req.request.index_type;

		var generic_callback = function( err, result ) {
			Private.log( 'Private.database.index.read > generic_callback', err, result);
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				var count = result.length;
				var items = [];
				if ( count > 0 ) {
					for ( var x = 0; x < count; x += 1 ) {
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
				own_on_complete( items );
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

		if ( type === 'relationship' ) {
			Private.log( 'Doing Private.db.getIndexedRelationships', index, key, value );
			Private.db.getIndexedRelationships( index, key, value, generic_callback );
		} else {
			Private.log( 'Doing Private.db.getIndexedNodes', index, key, value );
			Private.db.getIndexedNodes( index, key, value, generic_callback );
		}

	};

	/* Node */

	Private.node = Private.node || {};
	Private.node.validate = function( req ) {

		Private.log( 'Private.entities validation', req );

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
					Private.database.node.create( { request: req, on_success: own_on_success, on_error: own_on_error } );
				}

			} else {

				Private.database.node.create( { request: req, on_success: own_on_success, on_error: own_on_error } );

			}
		
			return true;

	};

	Private.node.destroy = function( req ) {

		Private.log( 'Private.node.destroy', req );

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

			var a = 0, alen = req.data.length, aitem;
			target = alen;

			for( a = 0; a < alen; a += 1 ) {
				Private.log("CALLING Private.database.node.destroy > a ", a );
				Private.database.node.destroy( { request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {

				Private.log("CALLING Private.database.node.destroy > b" );
			Private.database.node.destroy( { request: req, on_success: own_on_success, on_error: own_on_error } );

		}

		return true;

	};

	Private.node.update = function( req ) {

		Private.log( 'Private.entities.update', req );

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
		Private.log( 'Private.entities validation', req );
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

		Private.log( 'Private.entities.create', req );

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
				Private.database.relationship.update( { request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {

			Private.database.relationship.update( { request: req, on_success: own_on_success, on_error: own_on_error } );

		}

		return true;
	};

	Private.relationship.read = function( req ) {

		Private.log( 'Private.entities.read', req );

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

		Private.log( 'Private.entities validation', req );

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

	Private.index.update = function( req ) {

		Private.log( 'Private.entities.update', req );

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
				Private.database.index.update( { request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {

			Private.database.index.update( { request: req, on_success: own_on_success, on_error: own_on_error } );

		}

		return true;

	};

	Private.index.read = function( req ) {

		Private.log( 'Private.index.read', req );

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
				Private.database.index.read( { request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {

			Private.database.index.read( { request: req, on_success: own_on_success, on_error: own_on_error } );

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

