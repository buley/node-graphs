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

		var data = req.data;
		var generic_callback = function( err, result ) {
			Private.log( 'Private.database.node.create > generic_callback', err, result );
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				own_on_success( result );
			}
		};
		var own_on_success = function( res ) {
			if ( 'function' == typeof req.on_success ) {
				req.on_success( req, res );
			}
		};
		var own_on_error = function( res ) {
			if ( 'function' == typeof req.on_error ) {
				req.on_error( req, res );
			}
		};

		var node = Private.db.createNode( data );
		node.save( generic_callback );

	};

	Private.database.node.destroy = function( req ) {
		Private.log( 'Private.database.node.destroy', req );
		var own_on_success = function( res ) {
			if ( 'function' == typeof req.on_success ) {
				req.on_success( req, res );
			}
		};
		var own_on_complete = function( res ) {
			if ( 'function' == typeof req.on_complete ) {
				req.on_complete( req, res );
			}
		};
		var own_on_error = function( res ) {
			if ( 'function' == typeof req.on_error ) {
				req.on_error( req, res );
			}
		};

		var node = Private.db.createNode( data );
		node.save( generic_callback );

	};

	Private.database.node.update = function( req ) {
		Private.log( 'Private.database.node.update', req );
		var own_on_success = function( res ) {
			if ( 'function' == typeof req.on_success ) {
				req.on_success( req, res );
			}
		};
		var own_on_complete = function( res ) {
			if ( 'function' == typeof req.on_complete ) {
				req.on_complete( req, res );
			}
		};
		var own_on_error = function( res ) {
			if ( 'function' == typeof req.on_error ) {
				req.on_error( req, res );
			}
		};
		on_success( {} );
	};

	Private.database.node.read = function( req ) {
		Private.log( 'Private.database.node.read', req );

		var data = req.data;
		var generic_callback = function( err, result ) {
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				own_on_success( result );
			}
		};
		var own_on_success = function( res ) {
			if ( 'function' == typeof req.on_success ) {
				req.on_success( req, res );
			}
		};
		var own_on_error = function( res ) {
			if ( 'function' == typeof req.on_error ) {
				req.on_error( req, res );
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
				own_on_success( result );
			}
		};
		var own_on_success = function( res ) {
			if ( 'function' == typeof req.on_success ) {
				req.on_success( req, res );
			}
		};
		var own_on_error = function( res ) {
			if ( 'function' == typeof req.on_error ) {
				req.on_error( req, res );
			}
		};
		Private.db.getNodeById( from, function( error, from_node ) {
			if ( null !== error ) {
				own_on_error( req, from_node );
				return;
			}
			Private.db.getNodeById( to, function( error, to_node ) {
				if ( null !== error ) {
					own_on_error( req, to_node );
					return;
				}
				from_node.createRelationshipTo( to_node, name, data, generic_callback );
			} );
		} );

	};

	Private.database.relationship.destroy = function( req ) {
		Private.log( 'Private.database.relationship.destroy', req );
	};

	Private.database.relationship.update = function( req ) {
		Private.log( 'Private.database.relationship.update', req );
	};

	Private.database.relationship.read = function( req ) {
		Private.log( 'Private.database.relationship.read', req );

		var data = req.data;
		var generic_callback = function( err, result ) {
			if( 'undefined' !== typeof err && null !== err ) {
				own_on_error( err );
			} else {
				own_on_success( result );
			}
		};
		var own_on_success = function( res ) {
			if ( 'function' == typeof req.on_success ) {
				req.on_success( req, res );
			}
		};
		var own_on_error = function( res ) {
			if ( 'function' == typeof req.on_error ) {
				req.on_error( req, res );
			}
		};

		Private.db.getRelationshipById( id, generic_callback );

	};

	/* BEGIN */
	Private.node = Private.node || {};
	Private.node.validate = function( req ) {

		Private.log( 'Private.entities validation', req );

		var own_on_success = function( res ) {
			if ( 'function' == typeof req.on_success ) {
				req.on_success( req, res );
			}
		};

		var own_on_complete = function( res ) {
			if ( 'function' == typeof req.on_complete ) {
				req.on_complete( req, res );
			}
		};

		var own_on_error = function( res ) {
			if ( 'function' == typeof req.on_error ) {
				req.on_error( req, res );
			}
		};

		return true;

	};

	Private.node.createCreate = function( req ) {

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

				if ( 'function' == typeof req.on_success ) {
					req.on_success( req, res, current );
				}

				results.push( res );

				if ( current === target ) {
					own_on_complete( res, current );
				}

			};

			var own_on_complete = function( res, count ) {

				if ( 'function' == typeof req.on_complete ) {
					req.on_complete( req, results, count );
				}

			};

			var own_on_error = function( res ) {

				current += 1;

				if ( 'function' == typeof req.on_error ) {
					req.on_error( req, res, current );
				}

				results.push( res );

				if ( current === target ) {
					own_on_complete( res, target );
				}

			};

			if ( Array.isArray( req.data ) ) {

				var a = 0, alen = req.len, aitem;
				target = alen;

				for( a = 0; a < alen; a += 1 ) {
					Private.database.node.create( { type: req.type, request: req, on_success: own_on_success, on_error: own_on_error } );
				}

			} else {

				Private.database.node.create( { type: req.type, request: req, on_success: own_on_success, on_error: own_on_error } );

			}
		
			return true;

	};

	Private.node.createDestroy = function( req ) {

		Private.log( 'Private.entities.destroy', req );

		var target = 0
		, current = 0
		, results = []
		, own_on_success
		, own_on_complete
		, own_on_error
		, a = 0, alen = 0, aitem;

		var own_on_success = function( res ) {

			current += 1;

			if ( 'function' == typeof req.on_success ) {
				req.on_success( req, res, current );
			}

			results.push( res );

			if ( current === target ) {
				own_on_complete( res, current );
			}

		};

		var own_on_complete = function( res, count ) {

			if ( 'function' == typeof req.on_complete ) {
				req.on_complete( req, results, count );
			}

		};

		var own_on_error = function( res ) {

			current += 1;

			if ( 'function' == typeof req.on_error ) {
				req.on_error( req, res, current );
			}

			results.push( res );

			if ( current === target ) {
				own_on_complete( res, target );
			}

		};

		if ( Array.isArray( req.data ) ) {

			var a = 0, alen = req.len, aitem;
			target = alen;

			for( a = 0; a < alen; a += 1 ) {
				Private.database.node.destroy( { type: req.type, request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {

			Private.database.node.destroy( { type: req.type, request: req, on_success: own_on_success, on_error: own_on_error } );

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

			if ( 'function' == typeof req.on_success ) {
				req.on_success( req, res, current );
			}

			results.push( res );

			if ( current === target ) {
				own_on_complete( res, current );
			}

		};

		var own_on_complete = function( res, count ) {

			if ( 'function' == typeof req.on_complete ) {
				req.on_complete( req, results, count );
			}

		};

		var own_on_error = function( res ) {

			current += 1;

			if ( 'function' == typeof req.on_error ) {
				req.on_error( req, res, current );
			}

			results.push( res );

			if ( current === target ) {
				own_on_complete( res, target );
			}

		};

		if ( Array.isArray( req.data ) ) {

			var a = 0, alen = req.len, aitem;
			target = alen;

			for( a = 0; a < alen; a += 1 ) {
				Private.database.node.update( { type: req.type, request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {

			Private.database.node.update( { type: req.type, request: req, on_success: own_on_success, on_error: own_on_error } );

		}

		return true;

	};

	Private.node.read = function( req ) {

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

			if ( 'function' == typeof req.on_success ) {
				req.on_success( req, res, current );
			}

			results.push( res );

			if ( current === target ) {
				own_on_complete( res, current );
			}

		};

		var own_on_complete = function( res, count ) {

			if ( 'function' == typeof req.on_complete ) {
				req.on_complete( req, results, count );
			}

		};

		var own_on_error = function( res ) {

			current += 1;

			if ( 'function' == typeof req.on_error ) {
				req.on_error( req, res, current );
			}

			results.push( res );

			if ( current === target ) {
				own_on_complete( res, target );
			}

		};

		if ( Array.isArray( req.data ) ) {

			var a = 0, alen = req.len, aitem;
			target = alen;
			for( a = 0; a < alen; a += 1 ) {
				Private.database.node.read( { type: req.type, request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {

			Private.database.node.read( { type: req.type, request: req, on_success: own_on_success, on_error: own_on_error } );

		}

		return true;

	};

	Private.relationship = Private.relationship || {};

	Private.relationship.validate = function( req ) {
		Private.log( 'Private.entities validation', req );
		var own_on_success = function( res ) {
			if ( 'function' == typeof req.on_success ) {
				req.on_success( req, res );
			}
		};
		var own_on_complete = function( res ) {
			if ( 'function' == typeof req.on_complete ) {
				req.on_complete( req, res );
			}
		};
		var own_on_error = function( res ) {
			if ( 'function' == typeof req.on_error ) {
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

			if ( 'function' == typeof req.on_success ) {
				req.on_success( req, res, current );
			}

			results.push( res );

			if ( current === target ) {
				own_on_complete( res, current );
			}

		};

		var own_on_complete = function( res, count ) {

			if ( 'function' == typeof req.on_complete ) {
				req.on_complete( req, results, count );
			}

		};

		var own_on_error = function( res ) {

			current += 1;

			if ( 'function' == typeof req.on_error ) {
				req.on_error( req, res, current );
			}

			results.push( res );

			if ( current === target ) {
				own_on_complete( res, target );
			}

		};

		if ( Array.isArray( req.data ) ) {

			var a = 0, alen = req.len, aitem;
			target = alen;

			for( a = 0; a < alen; a += 1 ) {
				Private.database.relationship.create( { type: req.type, request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {
			Private.database.relationship.create( { type: req.type, request: req, on_success: own_on_success, on_error: own_on_error } );

		}
	
		return true;

	};

	Private.relationship.destroy = function( req ) {

		Private.log( 'Private.entities.destroy', req );

		var target = 0
		, current = 0
		, results = []
		, own_on_success
		, own_on_complete
		, own_on_error
		, a = 0, alen = 0, aitem;

		var own_on_success = function( res ) {

			current += 1;

			if ( 'function' == typeof req.on_success ) {
				req.on_success( req, res, current );
			}

			results.push( res );

			if ( current === target ) {
				own_on_complete( res, current );
			}

		};

		var own_on_complete = function( res, count ) {

			if ( 'function' == typeof req.on_complete ) {
				req.on_complete( req, results, count );
			}

		};

		var own_on_error = function( res ) {

			current += 1;

			if ( 'function' == typeof req.on_error ) {
				req.on_error( req, res, current );
			}

			results.push( res );

			if ( current === target ) {
				own_on_complete( res, target );
			}

		};

		if ( Array.isArray( req.data ) ) {

			var a = 0, alen = req.len, aitem;
			target = alen;

			for( a = 0; a < alen; a += 1 ) {
				Private.database.relationship.destroy( { type: req.type, request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {

			Private.database.relationship.destroy( { type: req.type, request: req, on_success: own_on_success, on_error: own_on_error } );

		}

		return true;

	};

	Private.relationship.update = function( req ) {

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

			if ( 'function' == typeof req.on_success ) {
				req.on_success( req, res, current );
			}

			results.push( res );

			if ( current === target ) {
				own_on_complete( res, current );
			}

		};

		var own_on_complete = function( res, count ) {

			if ( 'function' == typeof req.on_complete ) {
				req.on_complete( req, results, count );
			}

		};

		var own_on_error = function( res ) {

			current += 1;

			if ( 'function' == typeof req.on_error ) {
				req.on_error( req, res, current );
			}

			results.push( res );

			if ( current === target ) {
				own_on_complete( res, target );
			}

		};

		if ( Array.isArray( req.data ) ) {

			var a = 0, alen = req.len, aitem;
			target = alen;

			for( a = 0; a < alen; a += 1 ) {
				Private.database.relationship.update( { type: req.type, request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {

			Private.database.relationship.update( { type: req.type, request: req, on_success: own_on_success, on_error: own_on_error } );

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

			if ( 'function' == typeof req.on_success ) {
				req.on_success( req, res, current );
			}

			results.push( res );

			if ( current === target ) {
				own_on_complete( res, current );
			}

		};

		var own_on_complete = function( res, count ) {

			if ( 'function' == typeof req.on_complete ) {
				req.on_complete( req, results, count );
			}

		};

		var own_on_error = function( res ) {

			current += 1;

			if ( 'function' == typeof req.on_error ) {
				req.on_error( req, res, current );
			}

			results.push( res );

			if ( current === target ) {
				own_on_complete( res, target );
			}

		};

		if ( Array.isArray( req.data ) ) {

			var a = 0, alen = req.len, aitem;
			target = alen;

			for( a = 0; a < alen; a += 1 ) {
				Private.database.relationship.read( { type: req.type, request: req, on_success: own_on_success, on_error: own_on_error } );
			}

		} else {

			Private.database.relationship.read( { type: req.type, request: req, on_success: own_on_success, on_error: own_on_error } );

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
		}
	};

	Public.prototype.destroy = function( req ) {
		Private.log( 'Public.prototype.destroy', req );
		if ( true !== Private.connected ) this.connect();
		var datatype = req.datatype;
		delete req.datatype;
		if ( 'node' === datatype ) {
			Private.node.destroy( req );
		} else if ( 'relationship' === datatype ) {
			Private.relationship.destroy( req );
		}
	};

	return new Public();

} )(); 

