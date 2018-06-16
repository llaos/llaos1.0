// variables para funcionalidad del serividor Node JS + Express JS
var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	multer = require('multer'),
	cloudinary = require('cloudinary'),
	method_override  = require('method-override'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	method_override  = require('method-override'),
	nodemailer = require('nodemailer'),
	pdf = require('pdfkit'),
	fs = require('fs'),
	fileUpload = require('express-fileupload'),
	port = 3000,
	Schema = mongoose.Schema,
	app = express();
	compression = require('compression');
	
require('mongoose-double')(mongoose);


// Eliminar mensaje deprecation warning
mongoose.Promise = global.Promise;

// conexión a base de datos local mongoDB 
mongoose.connect("mongodb://localhost/llaosserv");

// Variables de conexión para envio de correo
	var smtpTransport = nodemailer.createTransport({
		host: 'mail.llaos.com',
		port: 587,
		secure: false,
		auth: {
			user: 'sistema@llaos.com',
			pass: '@Llaos2018'
		},
		tls: {
			rejectUnauthorized: false
		}
	});

/* Esquema de tablas  Mongodb JSON */

	// USUARIOS
	var usuarioSchemaJSON = {
		nombre: String,
		correo: String,
		usuario: String,
		password: String,
		nacimiento: String,
		numero_nomina: Number,
		empresa: String,
		unidad_negocio: String,
		permisos: String,
		autorizador: Boolean
	}

	// PRODUCTOS
	var productoSchemaJSON = {
		codigo: String,
		nombre: String,
		unidad: String,
		descripcion: String,
		precioUnitario: String,
		exentoiva: Boolean,
		iva: String,
		precioNeto: String,
		proveedor: String,
		moneda: String,
		cantidad: String,
		orden: String,
		factura: String,
		maximo: String,
		minimo: String,
		fecha: String,
		almacen: String
	}

	// PROVEEDORES
	var proveedorSchemaJSON = {
		codigo: String,
		tipoEmpresa: String,
		rfc: String,
		nombreEmpresa: String,
		razonSocial: String,
		curp: String,
		direccion: String,
		tipoPago: String,
		telefono: String,
		nombreVendedor: String,
		celular: String,
		correo: String,
		correo_empresa: String,
		banco: String,
		cuenta: String,
		clabe: String
	}

	// PROVEEDORES - LISTA DE BANCOS
	var ProveedoresBancosSchemaJSON = {
		preeveedor: String,
		banco: String,
		cuenta: String,
		clabe: String,
		moneda: String
	}

	// REQUISICIONES
	var requisicionSchemaJSON = {
		area: String,
		modulo: String,
		responsable: String,
		solicita: String,
		uso: String,
		estatus: String,
		fecha: String,
		hora: String,
		codigoRequi: String
	}

	// ARTICULOS REQUISICION
	var articuloRequisicionSchemaJSON = {
		codigoRequisicion: String,
		cantidad: Number,
		unidad: String,
		descripcion: String,
		estatus: String,
		proveedor: Boolean,
		nombreProveedor: String,
		telefonoProveedor: String,
		correoProveedor: String
	}

	// ORDENES DE COMPRA
	var ordenSchemaJSON = {
		proveedor: String,
		fecha: String,
		hora: String,
		subtotal: String,
		iva: String,
		total: String,
		serie: String,
		estatus: String,
		comentarios: String,
		factura: String
	}
	// ARTICULOS EN LA ORDEN
	var articulosOrdenSchemaJSON = {
		cantidad: String,
		unidad: String,
		codigo: String,
		producto: String,
		descripcion: String,
		precio_unitario: String,
		iva: String,
		importe: String,
		orden: String,
		requisicion: String
	}

	// COTIZACIÓN
	var cotizacionSchemaJSON = {
		codigo: String,
		proveedor: String,
		subtotal: String,
		iva: String,
		total: String,
		estatus: String,
		fecha: String,
		hora: String,
		vigencia: String,
		observaciones: String,
		moneda: String,
		tipoCambio: String,
		banco: String,
		cuenta: String,
		clabe: String
	}

	// ARTÍCULOS EN COTIZACIÓN
	var articulosCotizacionSchemaJSON = {
		codigo: String,
		cotizacion: String,
		cantidad: String,
		unidad: String,
		descripcion: String,
		precioUnitario: String,
		iva: String,
		precioNeto: String,
		tiempoEntrega: String
	}

	// INVENTARIOS
	var inventarioSchemaJSON = {
		codigo: String,
		producto: String,
		proveedor: String,
		unidad: String,
		cantidad: String,
		minimo: String,
		maximo: String,
		almacen: String,
		lugar: String
	}

	// REGISTRO ENTRADAS
	var entradaInventariosSchemaJSON = {
		producto: String,
		cantidad: String,
		orden: String,
		factura: String,
		fecha: String,
		hora: String,
		usuario: String
	}

	// REGISTRO SALIDAS
	var salidaInventariosSchemaJSON = {
		producto: String,
		cantidad: String,
		solicitante: String,
		area: String,
		modulo: String,
		Estanque: String,
		usuario: String,
		fecha: String,
		hora: String
	}

/***********************************/

/*  Convertir a schema de moongose */

	var usuarioSchema = new Schema(usuarioSchemaJSON);
	var productoSchema = new Schema(productoSchemaJSON);
	var proveedorSchema = new Schema(proveedorSchemaJSON);
	var requisicionSchema = new Schema(requisicionSchemaJSON);
	var articulosRequisicionSchema = new Schema(articuloRequisicionSchemaJSON);
	var ordenSchema = new Schema(ordenSchemaJSON);
	var articulosOrdenSchema = new Schema(articulosOrdenSchemaJSON);
	var cotizacionSchema = new Schema(cotizacionSchemaJSON);
	var articulosCotizacionSchema = new Schema(articulosCotizacionSchemaJSON);
	var inventariosSchema = new Schema(inventarioSchemaJSON);
	var bancoProveedoreSchema = new Schema(ProveedoresBancosSchemaJSON);
	var entradaInventariosSchema = new Schema(entradaInventariosSchemaJSON);
	var salidaInventariosSchema = new Schema(salidaInventariosSchemaJSON);

/***********************************/

/* Crear objetos de las tablas de MongoDB */

	var Usuarios = mongoose.model("Usuarios", usuarioSchema);
	var Productos = mongoose.model("Productos", productoSchema);
	var Proveedores = mongoose.model("Proveedores", proveedorSchema);
	var Requisiciones = mongoose.model("Requisiciones", requisicionSchema);
	var ArticulosRequisiciones = mongoose.model("ArticulosRequisiciones", articulosRequisicionSchema);
	var Ordenes = mongoose.model("Ordenes", ordenSchema);
	var ArticulosOrdenes = mongoose.model("ArticulosOrdenes", articulosOrdenSchema);
	var Cotizaciones = mongoose.model("Cotizaciones", cotizacionSchema);
	var ArticulosCotizaciones = mongoose.model("ArticulosCotizaciones", articulosCotizacionSchema);
	var Inventarios = mongoose.model("Inventarios", inventariosSchema);
	var BancosProveedores = mongoose.model("BancosProveedores", bancoProveedoreSchema);
	var EntradaInventarios = mongoose.model("EntradaInventarios", entradaInventariosSchema);
	var SalidaInventarios = mongoose.model("SalidaInventarios", salidaInventariosSchema);

/******************************************/


// Indicar a express que el motor visual será JADE/PUG
app.set("view engine","jade");

// Usos de expresss, utilizar bodyparser y carpetas publicas
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
	secret: "123byuhbsdah12ub",
    resave: false,
    saveUninitialized: true
}));
app.use(method_override("_method"));
app.use(express.static("public"));
app.use(express.static('files'));
app.use(fileUpload());
app.use(compression());
app.locals._      = require('underscore');
app.locals._.str  = require('underscore.string');
app.locals.moment = require('moment');

// Cambiar dependiendo lo necesario
var pag_sistema = "http://llaos.ddns.net:3000";

// Solo para pruebas sistemas
//var pag_sistema = "http://localhost:3000";

/* Métodos get */

	// Redireccionar a login / root
	app.get("/", function (solicitud, respuesta){
		respuesta.render("login",
			{ msg: "Por favor inicie sesión."}
		);
	});

	/* PROVEEDORES */

		// Registro de nuevo proveedor
		app.get("/proveedores", function(solicitud, respuesta){
			Proveedores.find( function(error, proveedores) {
				respuesta.render("Proveedores/proveedores", {
					user: solicitud.session.user,
					proveedores: proveedores
				});
			});
		});

		// Registro de nuevo proveedor
		app.get("/new/proveedor", function(solicitud, respuesta){
			respuesta.render("Proveedores/proveedor", 
			{
				user: solicitud.session.user
			});
		});

		// Registro de nuevo proveedor
		app.post("/proveedor", function(solicitud, respuesta){
			var data = {
				codigo: solicitud.body.codigo,
				tipoEmpresa: solicitud.body.tipoEmpresa,
				rfc: solicitud.body.rfc,
				nombreEmpresa: solicitud.body.nombreEmpresa,
				razonSocial: solicitud.body.razonSocial,
				curp: solicitud.body.curp,
				direccion: solicitud.body.direccion,
				tipoPago: solicitud.body.tipoPago,
				telefono: solicitud.body.telefono,
				nombreVendedor: solicitud.body.nombreVendedor,
				celular: solicitud.body.celular,
				correo: solicitud.body.correo,
				correo_empresa: solicitud.body.correo_empresa,
				banco: solicitud.body.banco,
				cuenta: solicitud.body.cuenta,
				clabe: solicitud.body.clabe
			}		

			var proveedor = new Proveedores(data);
	
			proveedor.save( function(error){
				if(error){
					console.log(error);
				}else{
					respuesta.redirect("/proveedores");
				}
			});
		});

		// Redireccionar al view editar proveedor
		app.get("/proveedor/editar/:id", function(solicitud, respuesta){
			Proveedores.findOne({"_id":solicitud.params.id}, function(error, proveedor){
				if(error){
					console.log(error);
				}else{
					if(solicitud.session.user === undefined){
						respuesta.redirect("/");
					}else{
						//if(solicitud.session.user.permisos === undefined){
							respuesta.render("Proveedores/editar",{
								user: solicitud.session.user, 
								proveedor: proveedor,
								//permisos: 'usuario'
							});
						/*}else{
							respuesta.render("producto/editar",{
								user: solicitud.session.user, 
								producto: producto,
								//permisos: solicitud.session.user.permisos
							});
						}*/
					}
				}
			});
		});

		// Eliminar proveedor
		app.get("/proveedor/eliminar/:id", function(solicitud, respuesta){
			Proveedores.remove({"_id": solicitud.params.id},function (error){
				if(error){
					console.log(error);
				}else{
					respuesta.redirect("/proveedores");
				}
			});
		});

		// Update proveedor
		app.put("/proveedor/:id", function(solicitud, respuesta){
			var data = {
				codigo: solicitud.body.codigo,
				tipoEmpresa: solicitud.body.tipoEmpresa,
				rfc: solicitud.body.rfc,
				nombreEmpresa: solicitud.body.nombreEmpresa,
				razonSocial: solicitud.body.razonSocial,
				curp: solicitud.body.curp,
				direccion: solicitud.body.direccion,
				tipoPago: solicitud.body.tipoPago,
				telefono: solicitud.body.telefono,
				nombreVendedor: solicitud.body.nombreVendedor,
				celular: solicitud.body.celular,
				correo: solicitud.body.correo,
				correo_empresa: solicitud.body.correo_empresa,
				banco: solicitud.body.banco,
				cuenta: solicitud.body.cuenta,
				clabe: solicitud.body.clabe
			};

			Proveedores.update({"_id": solicitud.params.id}, data, function (error){
				if(error){
					console.log(error);
				}else{
					respuesta.redirect("/proveedores");
				}
			});
		});

	/***************/

	/* ORDENES */

		// Ver todas las ordenes
		app.get("/compras/ordenes", function(solicitud, respuesta){
			if(solicitud.session.user === undefined){
				respuesta.redirect("/");
			}else{
				Ordenes.find( function(error, ordenes){
					if(error){
						console.log(error);
					} else {
						Proveedores.find( function(error, proveedores){
							if(error){
								console.log(error);
							} else {
								respuesta.render("Compras/ordenes/ordenes",
									{
										user: solicitud.session.user,
										orders: ordenes,
										proveedores: proveedores
									}
								);
							}
						});
					}
				});
			}
		})

		// Nueva Orden de compra
		app.get("/compras/new/orden", function(solicitud, respuesta){
			if(solicitud.session.user === undefined){
				respuesta.redirect("/");
			}else{
				Proveedores.find( function(error, proveedores){
					if(error){
						console.log(error);
					} else {
						respuesta.render("Compras/ordenes/orden", {
							user: solicitud.session.user,
							busca: '',
							criterio: '',
							products: {},
							articulos: {},
							orden: '',
							proveedores: proveedores,
							proveedor: '',
							serie: 'S-00000'
						});
					}
				});
				
			}
		})

		// Buscar productos por criterio de búsqueda
		app.post("/buscar/producto/:tipo", function(solicitud, respuesta){
			if(solicitud.body.codigo === 'undefined' || solicitud.body.codigo == null || solicitud.body.codigo == '') {
				if(solicitud.body.criterio == "codigo"){
					Productos.find( { "codigo": solicitud.body.buscar}, function(error, productos){
						if(error){
							console.log(error);
						} else {
							Proveedores.find( function(error, proveedores){
								if(error){
									console.log(error);
								} else {
									respuesta.render("Compras/ordenes/orden", {
										user: solicitud.session.user,
										busca: solicitud.body.buscar,
										criterio: solicitud.body.criterio,
										products: productos,
										proveedores: proveedores,
										articulos: {},
										orden: undefined,
										proveedor: solicitud.body.proveedor,
										serie: 'S-00000'
									});
								}
							});
						}
					});
				} else if(solicitud.body.criterio == "nombre") {
					Productos.find( { "nombre": { '$regex': solicitud.body.buscar, $options: "i"}}, function(error, productos){
						if(error){
							console.log(erro0r);
						} else {
							Proveedores.find( function(error, proveedores){
								if(error){
									console.log(error);
								} else {
									respuesta.render("Compras/ordenes/orden", {
										user: solicitud.session.user,
										busca: solicitud.body.buscar,
										criterio: solicitud.body.criterio,
										products: productos,
										proveedores: proveedores,
										articulos: {},
										orden: undefined,
										proveedor: solicitud.body.proveedor,
										serie: 'S-00000'
									});
								}
							});
						}
					});
				}
			} else {
				if(solicitud.body.criterio == "codigo"){
					Productos.find( { "codigo": solicitud.body.buscar}, function(error, productos){
						if(error){
							console.log(error);
						} else {
							Proveedores.find( function(error, proveedores){
								if(error){
									console.log(error);
								} else {
									ArticulosOrdenes.find({"orden": solicitud.body.codigo}, function(error, articulos){
										if(error){
											console.log(error);
										}else{
											Ordenes.findById({"_id": solicitud.body.codigo}, function(error, orden){
												if(error){
													console.log(error);
												} else {
													if(solicitud.params.tipo == 1) {
														respuesta.render("Compras/ordenes/orden", {
															user: solicitud.session.user,
															busca: solicitud.body.buscar,
															criterio: solicitud.body.criterio,
															products: productos,
															proveedores: proveedores,
															articulos: articulos,
															orden: orden.id,
															proveedores: proveedores,
															proveedor: orden.proveedor,
															serie: orden.serie,
															articulo: {},
															comentario: orden.comentarios,
															estatus: orden.estatus
														});
													} else if(solicitud.params.tipo == 2) {
														respuesta.render("Compras/ordenes/editar", {
															user: solicitud.session.user,
															busca: solicitud.body.buscar,
															criterio: solicitud.body.criterio,
															products: productos,
															proveedores: proveedores,
															articulos: articulos,
															orden: orden.id,
															proveedores: proveedores,
															proveedor: orden.proveedor,
															serie: orden.serie,
															articulo: {},
															comentario: orden.comentarios,
															estatus: orden.estatus
														});
													}	
												}
											});
										}
									});
								}
							});
						}
					});
				} else if(solicitud.body.criterio == "nombre") {
					Productos.find( { "nombre": { '$regex': solicitud.body.buscar, $options: "i"}}, function(error, productos){
						if(error){
							console.log(error);
						} else {
							Proveedores.find( function(error, proveedores){
								if(error){
									console.log(error);
								} else {
									ArticulosOrdenes.find({"orden": solicitud.body.codigo}, function(error, articulos){
										if(error){
											console.log(error);
										}else{
											Ordenes.findById({"_id": solicitud.body.codigo}, function(error, orden){
												if(error){
													console.log(error);
												} else {
													if(solicitud.params.tipo == 1) {
														respuesta.render("Compras/ordenes/orden", {
															user: solicitud.session.user,
															busca: solicitud.body.buscar,
															criterio: solicitud.body.criterio,
															products: productos,
															proveedores: proveedores,
															articulos: articulos,
															orden: orden.id,
															proveedores: proveedores,
															proveedor: orden.proveedor,
															serie: orden.serie,
															articulo: {},
															comentario: orden.comentarios,
															estatus: orden.estatus
														});
													} else if(solicitud.params.tipo == 2) {
														respuesta.render("Compras/ordenes/editar", {
															user: solicitud.session.user,
															busca: solicitud.body.buscar,
															criterio: solicitud.body.criterio,
															products: productos,
															proveedores: proveedores,
															articulos: articulos,
															orden: orden.id,
															proveedores: proveedores,
															proveedor: orden.proveedor,
															serie: orden.serie,
															articulo: {},
															comentario: orden.comentarios,
															estatus: orden.estatus
														});
													}
												}
											});
										}
									});
								}
							});
						}
					});
				}
			}		
		})

		// Agregar producto a artículo en orden de compra
		app.get("/agregar/producto/:id/:id_orden/:id_prov/:cant/:req/:coment", function(solicitud, respuesta){
			var existe,
				subtotal = 0.00,
				iva = 0.00,
				total = 0.00;

			console.log(solicitud.params.id_orden);
				
			// Orden nueva
			if(solicitud.params.id_orden === 'undefined' || solicitud.params.id_orden == null){
				console.log(" Nueva orden");
				var serie_orden;

				Ordenes.find( function(error, orders){
					if(error){
						console.log(error);
					} else {
						if(solicitud.session.user.numero_nomina == 304) {
							serie_orden = "M-" + zfill(orders.length + 1, 5);
						} else if(solicitud.session.user.numero_nomina == 305){
							serie_orden = "I-" + zfill(orders.length + 1, 5);
						}
		
						var dataOrd = {
							proveedor: solicitud.params.id_prov,
							fecha: obtenerfecha(),
							hora: obtenerhora(),
							subtotal: '0.00',
							iva: '0.00',
							total: '0.00',
							serie: serie_orden,
							estatus: 'Nueva',
							comentarios: solicitud.params.coment
						}
		
						var orden = new Ordenes(dataOrd);
		
						orden.save( function(error, ord){
							if(error){
								console.log(error);
							} else {
								Productos.findById({"_id": solicitud.params.id}, function(error, producto){
									if(error){
										console.log(error);
									} else {
										ArticulosOrdenes.findOne({ $and: [ {"orden": ord.id},{"codigo": producto.codigo} ]}, function(error, arti){
											if(error){
												console.log(error);
											} else {
												if(arti != null){
													var updCant = {
														cantidad: parseFloat(parseFloat(arti.cantidad) + parseFloat(solicitud.params.cant)).toFixed(2)
													}

													ArticulosOrdenes.update({"_id": arti.id}, updCant, function(error){
														if(error){
															console.log(error);
														} else {
															ArticulosOrdenes.find({"orden": ord.id}, function(error, artOrd){
																artOrd.forEach( function(art) {
																	subtotal = parseFloat(subtotal) + parseFloat(art.precio_unitario);
																	iva = parseFloat(iva) + parseFloat(art.iva);
																	total = parseFloat(total) + parseFloat(art.importe);
																}); 
															
																var dataUpd = {
																	subtotal: subtotal.toFixed(2),
																	iva: iva.toFixed(2),
																	total: total.toFixed(2)
																}
					
																Ordenes.update({"_id": ord.id}, dataUpd, function(error){
																	if(error){
																		console.log(error);
																	}else{
																		ArticulosOrdenes.find({"orden": ord.id}, function(error, articulos){
																			if(error){
																				console.log(error);
																			} else {
																				Proveedores.find( function(error, proveedores){
																					if(error){
																						console.log(error);
																					} else {
																						respuesta.render("Compras/ordenes/orden", {
																							user: solicitud.session.user,
																							busca: '',
																							criterio: '',
																							products: {},
																							orden: ord.id,
																							articulos: articulos,
																							subtotal: subtotal.toFixed(2),
																							iva: iva.toFixed(2),
																							total: total.toFixed(2),
																							proveedores: proveedores,
																							proveedor: solicitud.params.id_prov,
																							comentario: solicitud.params.coment
																						});
																					}
																				});
																			}
																		});
																	}
																});
															});	
														}
													})
												} else {

													var importe = 0.00,
														ivaArt = 0.00,
														pUnitario = 0.00;
													
													pUnitario = parseFloat(parseFloat(producto.precioUnitario) * parseFloat(solicitud.params.cant))
													importe =  parseFloat(parseFloat(producto.precioNeto) * parseFloat(solicitud.params.cant))
													ivaArt = parseFloat(parseFloat(producto.iva) * parseFloat(solicitud.params.cant));

													var dataO = {
														cantidad: parseFloat(solicitud.params.cant).toFixed(2),
														unidad: producto.unidad,
														codigo: producto.codigo,
														producto: producto.nombre,
														descripcion: producto.descripcion,
														precio_unitario: pUnitario.toFixed(2),
														importe: importe.toFixed(2),
														iva: ivaArt.toFixed(2),
														orden: ord.id,
														requisicion: solicitud.params.req
													}		
										
													var articuloOrden = new ArticulosOrdenes(dataO);
											
													console.log(dataO);

													articuloOrden.save( function(error){
														if(error){
															console.log(error);
														}else{
															ArticulosOrdenes.find({"orden": ord.id}, function(error, artOrd){
																artOrd.forEach( function(art) {
																	subtotal = parseFloat(subtotal) + parseFloat(art.precio_unitario);
																	iva = parseFloat(iva) + parseFloat(art.iva);
																	total = parseFloat(total) + parseFloat(art.importe);
																}); 
															
																var dataUpd = {
																	subtotal: subtotal.toFixed(2),
																	iva: iva.toFixed(2),
																	total: total.toFixed(2)
																}

																console.log(dataUpd);
					
																Ordenes.update({"_id": ord.id}, dataUpd, function(error){
																	if(error){
																		console.log(error);
																	}else{
																		ArticulosOrdenes.find({"orden": ord.id}, function(error, articulos){
																			if(error){
																				console.log(error);
																			} else {
																				Proveedores.find( function(error, proveedores){
																					if(error){
																						console.log(error);
																					} else {
																						respuesta.render("Compras/ordenes/orden", {
																							user: solicitud.session.user,
																							busca: '',
																							criterio: '',
																							products: {},
																							orden: ord.id,
																							articulos: articulos,
																							subtotal: subtotal.toFixed(2),
																							iva: iva.toFixed(2),
																							total: total.toFixed(2),
																							proveedores: proveedores,
																							proveedor: solicitud.params.id_prov,
																							comentario: solicitud.params.coment,
																							articulo: {},
																							estatus: "Nueva",
																							serie: serie_orden
																						});
																					}
																				});
																			}
																		});
																	}
																});
															});	
														}
													});
												}
											}
										});
									}
								});
							}
						});
					}
				});
			} else {
				console.log(" Existe orden");
				Productos.findById({"_id": solicitud.params.id}, function(error, producto){
					if(error){
						console.log(error);
					} else {					
						ArticulosOrdenes.findOne({ $and: [ {"orden": solicitud.params.id_orden},{"codigo": producto.codigo} ]}, function(error, arti){
							if(error){
								console.log(error);
							} else {
								
								if(arti != null){

									var importe = 0.00,
										ivaArt = 0.00,
										pUnitario = 0.00;
									
									pUnitario = parseFloat(parseFloat(producto.precioUnitario) * parseFloat(parseFloat(arti.cantidad ) + parseFloat(solicitud.params.cant)));
									importe =  parseFloat(parseFloat(producto.precioNeto) * parseFloat(parseFloat(arti.cantidad ) + parseFloat(solicitud.params.cant)));
									ivaArt = parseFloat(parseFloat(producto.iva) * parseFloat(parseFloat(arti.cantidad ) + parseFloat(solicitud.params.cant)));

									var updCant = {
										cantidad: parseFloat(parseFloat(arti.cantidad) + parseFloat(solicitud.params.cant)).toFixed(2),
										precio_unitario: pUnitario.toFixed(2),
										importe: importe.toFixed(2),
										iva: iva.toFixed(2),
									}

									ArticulosOrdenes.update({"_id": arti.id}, updCant, function(error){
										if(error){
											console.log(error);
										} else {
											ArticulosOrdenes.find({"orden": solicitud.params.id_orden}, function(error, artOrd){
												artOrd.forEach( function(art) {
													subtotal = parseFloat(subtotal) + parseFloat(art.precio_unitario);
													iva = parseFloat(iva) + parseFloat(art.iva);
													total = parseFloat(total) + parseFloat(art.importe);
												}); 						
			
												var dataOrdUpd = {
													subtotal: subtotal.toFixed(2),
													iva: iva.toFixed(2),
													total: total.toFixed(2)
												}
								
												console.log(dataOrdUpd);

												Ordenes.update({"_id": solicitud.params.id_orden}, dataOrdUpd, function(error){
													if(error){
														console.log(error);
													}else{
														ArticulosOrdenes.find({"orden": solicitud.params.id_orden}, function(error, articulos){
															if(error){
																console.log(error);
															} else {
																Proveedores.find( function(error, proveedores){
																	if(error){
																		console.log(error);
																	} else {
																		Ordenes.findById({"_id": solicitud.params.id_orden}, function(error, orden){
																			if(error){
																				console.log(error);
																			} else {
																				respuesta.render("Compras/ordenes/orden", {
																					user: solicitud.session.user,
																					busca: '',
																					criterio: '',
																					products: {},
																					orden: solicitud.params.id_orden,
																					articulos: articulos,
																					subtotal: subtotal.toFixed(2),
																					iva: iva.toFixed(2),
																					total: total.toFixed(2),
																					proveedores: proveedores,
																					proveedor: solicitud.params.id_prov,
																					comentario: solicitud.params.coment,
																					articulo: {},
																					estatus: orden.estatus,
																					serie: orden.serie,
																				});
																			}
																		})
																	}
																});
															}
														});
													}
												});
											});
										}
									});
								} else {
									var importe = 0.00,
										ivaArt = 0.00,
										pUnitario = 0.00;
									
									pUnitario = parseFloat(parseFloat(producto.precioUnitario) * parseFloat(solicitud.params.cant));
									importe =  parseFloat(parseFloat(producto.precioNeto) * parseFloat(solicitud.params.cant));
									ivaArt = parseFloat(parseFloat(producto.iva) * parseFloat(solicitud.params.cant));


									var data = {
										cantidad: solicitud.params.cant,
										unidad: producto.unidad,
										codigo: producto.codigo,
										producto: producto.nombre,
										descripcion: producto.descripcion,
										precio_unitario: pUnitario.toFixed(2),
										importe: importe.toFixed(2),
										iva: ivaArt.toFixed(2),
										orden: solicitud.params.id_orden,
										requisicion: solicitud.params.req
									}		
						
									var articuloOrden = new ArticulosOrdenes(data);
							
									articuloOrden.save( function(error){
										if(error){
											console.log(error);
										}else{
											ArticulosOrdenes.find({"orden": solicitud.params.id_orden}, function(error, artOrd){
												artOrd.forEach( function(art) {
													subtotal = parseFloat(subtotal) + parseFloat(art.precio_unitario);
													iva = parseFloat(iva) +parseFloat(art.iva);
													total = parseFloat(total) + parseFloat(art.importe);
												}); 						
			
												var dataOrdUpd = {
													subtotal: subtotal.toFixed(2),
													iva: iva.toFixed(2),
													total: total.toFixed(2)
												}

												console.log(dataOrdUpd);
								
												Ordenes.update({"_id": solicitud.params.id_orden}, dataOrdUpd, function(error){
													if(error){
														console.log(error);
													}else{
														ArticulosOrdenes.find({"orden": solicitud.params.id_orden}, function(error, articulos){
															if(error){
																console.log(error);
															} else {
																Proveedores.find( function(error, proveedores){
																	if(error){
																		console.log(error);
																	} else {
																		Ordenes.findById({"_id": solicitud.params.id_orden}, function(error, orden){
																			if(error){
																				console.log(error);
																			} else {
																				respuesta.render("Compras/ordenes/orden", {
																					user: solicitud.session.user,
																					busca: '',
																					criterio: '',
																					products: {},
																					orden: solicitud.params.id_orden,
																					articulos: articulos,
																					subtotal: subtotal.toFixed(2),
																					iva: iva.toFixed(2),
																					total: total.toFixed(2),
																					proveedores: proveedores,
																					proveedor: solicitud.params.id_prov,
																					comentario: solicitud.params.coment,
																					estatus: orden.estatus,
																					serie: orden.serie,
																				});
																			}
																		});
																	}
																});
															}
														});
													}
												});
											});
										}
									});
								}
							}
						})
					}
				});
			}
		})

		// Crear pdf de orden de compra
		app.get("/orden/generar/pdf/:id/:tipo", function(solicitud, respuesta){
			Ordenes.findById({"_id": solicitud.params.id}, function(error, orden){
				if(error){
					console.log(error);
				} else {
					ArticulosOrdenes.find({"orden": orden.id}, function(error, articulos){
						if(error){
							console.log(error);
						} else {
							Proveedores.findById({"_id": orden.proveedor}, function(error, proveedor){
								if(error){
									console.log(error);
								} else {
									// Crear el documento
									doc = new pdf({
										// Establecer tamaño de hoja
										size: 'letter'
									});
								
									// Logo empresa
									doc.image('./public/imgs/logo.png', 5, 40,{width: 200})
									
									// Nombre empresa y rfc
									doc.font('fonts/Roboto-Black.ttf')
									.fontSize(14)
									.text('LLAOS ACUACULTURA S.A. de C.V.', 310, 40, { align: 'right', width: 290 })
									.text('LAC040819TN1', { align: 'right', width: 290 })
									
									// Nombre formato, fecha y hora de creación
									doc.font('fonts/Roboto-Regular.ttf')
									.fontSize(14)
									.text("Orden de Compra",{ align: 'right' , width: 290})
									.text("Fecha: "+ obtenerfecha() + " - Hora: " + obtenerhora(),{ align: 'right' , width: 290})
									
									// Serie de la orden I = insumos M = mantenimientos
									doc.font('fonts/Roboto-Black.ttf')
									.text("Serie: " + orden.serie, {align: 'right', width: 290});

									// Cuadro orden de compra y orden número
									doc.font('fonts/Roboto-Regular.ttf')
									doc.lineWidth(25)
									doc.lineCap('butt')
									.fillColor("blue")
									.moveTo(400, 160)
									.lineTo(600, 160)
									.stroke()
								
									doc.fontSize(12)
									.fill('white')
									.text("No. Orden", 470, 150)
								
									doc.polygon([401,170],[599,170],[599,195],[401,195])
									.lineWidth(2)
									.stroke()
									
									doc.fill('black')
									doc.text(orden.id, 395, 175, { align: 'center' , width: 200})
								
									// Datos de la empresa
									doc.fillColor('black')
									doc.text("Flavio Borquez #1603 A", 15, 140, { align: 'left', width: 200})
									.text("Col. Prados del Tepeyac", { align: 'left', width: 200})
									.text("C.P. 85150, Cd. Obregón, Sonora.", { align: 'left', width: 200})
								
									// Datos del proveedor
									doc.font('fonts/Roboto-Black.ttf')
									.text("Proveedor", 15, 210, { align: 'left', width: 200})
									.font('fonts/Roboto-Regular.ttf')
									.text( proveedor.codigo  + " - " + proveedor.nombreEmpresa, { align: 'left', width: 800})
								
									// Encabezados tabla
									doc.lineWidth(25)
									doc.lineCap('butt')
									.fillColor("blue")
									.moveTo(15, 280)
									.lineTo(600, 280)
									.stroke()
								
									doc.fontSize(12)
									.fill('white')
									.text("Cant", 17, 270, {align: 'center', width: 45})
									.text("Codigo", 59, 270,  {align: 'center', width: 70})
									.text("Descripción",109, 270, {align: 'center', width: 250})
									.text("Unidad",389, 270, {align: 'center', width: 45})
									.text("P. Unitario",454, 270, {align: 'center', width: 80})
									.text("Importe",529, 270, {align: 'center', width: 80})
								
									// Llenado de tabla
									var y = 280,
										subtotal = 0.00,
										iva = 0.00,
										total = 0.00;

									articulos.forEach( function(art) {
										y += 15;

										var pU = parseFloat(art.precio_unitario) / parseFloat(art.cantidad);

										doc.fillColor('black')
										.text(art.cantidad, 17, y, {align: 'center', width: 45})
										.text(art.codigo, 59, y,  {align: 'center', width: 70})
										.text(art.producto, 134, y, {align: 'left', width: 250})
										.text(art.unidad, 389, y, {align: 'center', width: 45})
										.text(FormatMoney(true,pU), 454, y, {align: 'center', width: 80})
										.text(FormatMoney(true,parseFloat(art.precio_unitario)), 529, y, {align: 'center', width: 80})
									
										subtotal += parseFloat(art.precio_unitario);
										iva += parseFloat(art.iva);
										total += parseFloat(art.importe);
									});
													
									// División productos y totales
									doc.lineWidth(2)
									doc.lineCap('butt')
									.moveTo(15, 665)
									.lineTo(600, 665)
									.stroke()
									
									// Conciciones / Observaciones / Comentarios
									doc.font('fonts/Roboto-Black.ttf')
									.text("Conciciones / Observaciones / Comentarios", 15, 670, { align: 'left', width: 400 })
									doc.font('fonts/Roboto-Regular.ttf')
									.text(orden.comentarios, 20, 685, { align: 'left', width: 480 })

									// Subtotal, IVA y total
									doc.text("Subtotal", 440, 670, { align: 'right', width: 80 })
									.text(FormatMoney(true,subtotal), 520, 670, { align: 'right', width: 80 })
									.text("IVA", 440, 685, { align: 'right', width: 80 })
									.text(FormatMoney(true,iva), 520, 685, { align: 'right', width: 80 })
									.text("Total", 440, 700, { align: 'right', width: 80 })
									.text(FormatMoney(true,total), 520, 700, { align: 'right', width: 80 })
								
									// Creación del documento y guardado

									var nombre_archivo = './files/' + orden.serie + '.pdf';
									
									console.log(nombre_archivo);

									doc.pipe(fs.createWriteStream(nombre_archivo)).on('finish', function (){
										console.log('PDF closed');
									});
								
									// Finalize PDF file
									doc.end();

									var updSta = {
										estatus: 'Generada'
									}

									Ordenes.update({"_id": orden.id}, updSta, function(error){
										if(error){
											console.log(error);
										} else {
											console.log("Update estatus correcto!")
										}
									});

									//Finalización del get

									// 
									if(solicitud.params.tipo == 1){
										Ordenes.find( function(error, ordenes){
											if(error){
												console.log(error);
											} else {
												Proveedores.find( function(error, proveedores){
													if(error){
														console.log(error);
													} else {
														respuesta.render("Compras/ordenes/ordenes",
															{
																user: solicitud.session.user,
																orders: ordenes,
																proveedores: proveedores
															}
														);
													}
												});
											}
										});
									} else if(solicitud.params.tipo == 2){
										Proveedores.find( function(error, proveedores){
											if(error){
												console.log(error)
											} else {
												respuesta.render("Compras/ordenes/orden", {
													user: solicitud.session.user,
													busca: '',
													criterio: '',
													products: {},
													orden: orden.id,
													articulos: articulos,
													subtotal: orden.subtotal,
													iva: orden.iva,
													total: orden.total,
													proveedores: proveedores,
													proveedor: orden.proveedor,
													serie: orden.serie,
													comentario: orden.comentarios,
													estatus: orden.estatus
												});
											}
										});
									} else if(solicitud.params.tipo == 3){
										respuesta.render("Compras/ordenes/editar", {
											user: solicitud.session.user,
											busca: '',
											criterio: '',
											products: {},
											articulos: articulos,
											orden: orden.id,
											proveedores: proveedores,
											proveedor: orden.proveedor,
											subtotal: orden.subtotal,
											iva: orden.iva,
											total: orden.total,
											estatus: orden.estatus,
											serie: orden.serie,
											articulo: {},
											comentario: orden.comentarios
										});
									}
								}
							});
						}
					});
				}
			});
		})

		// Enviar correo al proveedor con la orden de compra
		app.get("/orden/enviar/:id/:tipo", function(solicitud, respuesta){
			Ordenes.findById({"_id": solicitud.params.id}, function(error, orden){
				if(error){
					console.log(error);
				} else {
					Proveedores.findById({"_id": orden.proveedor}, function(error, proveedor){
						var mailOptions = {
							from: 'Llaos Sist 1.0 <sistema@llaos.com>',
							to: proveedor.correo_empresa,
							subject: 'Orden de compra ' + orden.serie,
							html: "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>"+
										"<html xmlns='http://www.w3.org/1999/xhtml'>" +
											"<head>" +
												"<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />" +
												"<title>Requisiciones LLaos 1.0</title>" +
												"<style type='text/css'>" +
													"body {margin: 0; padding: 0; min-width: 100%!important;}" +
													".content {width: 100%; max-width: 600px;}" +
													"@media only screen and (min-device-width: 601px) {" +
													"	.content {width: 600px !important;}" +
													"	.header {padding: 40px 30px 20px 30px;}" +
													"}" +
													"@media only screen and (min-device-width: 601px) {" +
													"	.content {width: 600px !important;}" +
													"	.col425 {width: 425px!important;}" +
													"	.col380 {width: 380px!important;}" +
													"}" +
													"@media only screen and (max-width: 550px), screen and (max-device-width: 550px) {" +
													"	body[yahoo] .buttonwrapper {background-color: transparent!important;}" +
													"	body[yahoo] .button a {background-color: #e05443; padding: 15px 15px 13px!important; display: block!important;}" +
													"}" +
													".col425 {width: 425px!important;}" +
													".subhead {font-size: 15px; color: #ffffff; font-family: sans-serif; letter-spacing: 10px;}" +
													".h1 {font-size: 33px; line-height: 38px; font-weight: bold;}" +
													".h1, .h2, .bodycopy {color: #153643; font-family: sans-serif;}" +
													".innerpadding {padding: 30px 30px 30px 30px; text-align: justify;}" +
													".borderbottom {border-bottom: 1px solid #f2eeed; text-align: justify;}" +
													".h2 {padding: 0 0 15px 0; font-size: 24px; line-height: 28px; font-weight: bold;}" +
													".bodycopy {font-size: 16px; line-height: 22px;  text-align: justify;}" +
													".button {text-align: center; font-size: 18px; font-family: sans-serif; font-weight: bold; padding: 0 30px 0 30px;}" +
													".button a {color: #ffffff; text-decoration: none;}" +
													".footer {padding: 20px 30px 15px 30px;}" +
													".footercopy {font-family: sans-serif; font-size: 14px; color: #ffffff;}" +
													".footercopy a {color: #ffffff; text-decoration: underline;}" +
												"</style>" +
											"</head>" +
											"<body yahoo bgcolor='#f6f8f1'>" +
												"<table width='100%' bgcolor='#f6f8f1' border='0' cellpadding='0' cellspacing='0'>" +
													"<tr>" +
														"<td>" +
															"<!--[if (gte mso 9)|(IE)]>" +
															"<table width='600' align='center' cellpadding='0' cellspacing='0' border='0'>" +
																"<tr>" +
																	"<td>" +
																		"<![endif]-->" +
																		"<table class='content' align='center' cellpadding='0' cellspacing='0' border='0'>" +
																			"<!-- HEADER -->" +
																			"<tr>" +
																				"<td class='header' bgcolor='#c7d8a7'>" +
																					"<table width='70' align='left' border='0' cellpadding='0' cellspacing='0'>" +
																						"<tr>" +
																							"<td height='70' style='padding: 0 20px 20px 0;'>" +
																								"<img src='cid:unique@headerMail' width='70' height='70' border='0' alt='' / >" +
																							"</td>" +
																						"</tr>" +
																					"</table>" +
																					"<!--[if (gte mso 9)|(IE)]>" +
																					"<table width='425' align='left' cellpadding='0' cellspacing='0' border='0'>" +
																						"<tr>" +
																							"<td>" +
																							"<![endif]-->" +
																								"<table class='col425' align='left' border='0' cellpadding='0' cellspacing='0' style='width: 100%; max-width: 425px;'>" +
																									"<tr>" +
																										"<td height='70'>" +
																											"<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
																												"<tr>" +
																													"<td class='subhead' style='padding: 0 0 0 3px;'>" +
																													"	LLAOS 1.0" +
																													"</td>" +
																												"</tr>" +
																												"<tr>" +
																													"<td class='h1' style='padding: 5px 0 0 0;'>" +
																													"	Ordenes de Compra" +
																													"</td>" +
																												"</tr>" +
																											"</table>" +
																										"</td>" +
																									"</tr>" +
																								"</table>" + 
																							"<!--[if (gte mso 9)|(IE)]>" +
																							"</td>" +
																						"</tr>" +
																					"</table>" +
																					"<![endif]-->" +
																				"</td>" +
																			"</tr>" +
																			"<!-- CONTENIDO 1 -->" +
																			"<tr>" +
																				"<td class='innerpadding borderbottom'>" +
																					"<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
																						"<tr>" +
																							"<td class='h2'>" +
																							"	Estimado "+ proveedor.nombreEmpresa +" :" +
																							"</td>" +
																						"</tr>" +
																						"<tr>" +
																							"<td class='bodycopy'>" +
																							"	El departamento de compras de <strong> Llaos Acuacultura S.A. de C.V. </strong> acaba de realizar" +
																							"	una orden de compra con el código <strong>" + orden.serie + "</strong> misma que esta adjunta a este" +
																							" 	correo, la cual ya ha sido debidamente autorizada, y se solicita surtir por completo la misma, al "+
																							" 	personal que la empresa autorizar recoger los articulos."+
																							"</td>" +
																						"</tr>" +
																					"</table>" +
																				"</td>" +
																			"</tr>" +
																			"<!-- CONTENIDO 3 -->" +
																			"<tr>" +
																				"<td class='innerpadding borderbottom'>" +
																				"	Este correo ha sido generado en automático por el sistema" +
																				"	llaos 1.0, no responda al mismo ya que no tendrá respuesta" +
																				"	alguna, si usted no es un usuario que autoriza Requisiciones" +
																				"	favor de reportar el insidente al departamento de sistemas." +
																				"<br>" +
																				"<br>" +
																				"	Cualquier problema para abrir la requisición o el sistema" +
																				"	favor de reportar al departamento de sistemas." +
																				"</td>" +
																			"</tr>" +
																			"<!-- FOOTER -->" +
																			"<tr>" +
																				"<td class='footer' bgcolor='#44525f'>" +
																					"<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
																						"<tr>" +
																							"<td align='center' class='footercopy'>" +
																							"	&reg; Llaos Acuacultura S.A. de C.V. " + new Date().getFullYear() + 
																							"</td>" +
																						"</tr>" +
																					"</table>" +
																				"</td>" +
																			"</tr>" +
																		"</table>" +
																		"<!--[if (gte mso 9)|(IE)]>" +
																	"</td>" +
																"</tr>" +
															"</table>" +
															"<![endif]-->" +
														"</td>" +
													"</tr>" +
												"</table>" +
											"</body>" +
										"</html>",
							attachments:[
								{
									fileName: 'mail.png',
									path: './public/imgs/mail.png',
									cid: 'unique@headerMail'
								},
								{
									fileName: orden.serie + '.pdf',
									path: './files/' + orden.serie + '.pdf',
									cid: 'unique@pdf'
								},
							]
						}
	
						smtpTransport.sendMail(mailOptions, function(error,res){
							if(error){
								console.log(error);
							}else{
								console.log(res);

								var updSta = {
									estatus: 'Enviada'
								}

								Ordenes.update({"_id": orden.id}, updSta, function(error){
									if(error){
										console.log(error);
									} else {
										console.log("Update estatus correcto!")
									}
								});
								

								if(solicitud.params.tipo == 1){
									respuesta.render("Compras/ordenes/enviada", {
										user: solicitud.session.user
									});
								} else if(solicitud.params.tipo == 2){
									respuesta.redirect("/compras/ordenes")
								}	
								

								console.log("Correo enviado!")
							}
							smtpTransport.close();
						});
					});
				}
			})
		})

		// Eliminar artículo de orden de compra
		app.get("/orden/eliminar/articulo/:id/:id_orden/:tipo", function(solicitud, respuesta){
			ArticulosOrdenes.remove({"_id": solicitud.params.id}, function(error){
				if(error){
					console.log(error);
				} else {
					Proveedores.find( function(error, proveedores){
						if(error){
							console.log(error);
						} else {
							ArticulosOrdenes.find({"orden": solicitud.params.id_orden}, function(error, articulos){
								if(error){
									console.log(error);
								} else {
									var subtotal = 0,
										iva = 0,
										total = 0;

									articulos.forEach( function(art) {
										subtotal = parseFloat(subtotal) + parseFloat(art.precio_unitario);
										iva = parseFloat(iva) + parseFloat(art.iva);
										total = parseFloat(total) + parseFloat(art.importe);
									}); 						

									var dataOrdUpd = {
										subtotal: subtotal,
										iva: iva,
										total: total
									}
					
									Ordenes.update({"_id": solicitud.params.id_orden}, dataOrdUpd, function(error, ord){
										if(error){
											console.log(error);
										} else {
											Ordenes.findById({"_id": solicitud.params.id_orden}, function(error, ord){
												if(error){
													console.log(error);
												} else { 
													if(solicitud.params.tipo == 1){
														respuesta.render("Compras/ordenes/orden", {
															user: solicitud.session.user,
															busca: '',
															criterio: '',
															products: {},
															orden: ord.id,
															articulo: {},
															articulos: articulos,
															subtotal: ord.subtotal,
															iva: ord.iva,
															total: ord.total,
															proveedores: proveedores,
															proveedor: ord.proveedor,
															serie: ord.serie,
															comentario: ord.comentarios,
															estatus: ord.estatus
														});
													} else if (solicitud.params.tipo == 2){
														respuesta.render("Compras/ordenes/editar", {
															user: solicitud.session.user,
															busca: '',
															criterio: '',
															products: {},
															orden: ord.id,
															articulo: {},
															articulos: articulos,
															subtotal: ord.subtotal,
															iva: ord.iva,
															total: ord.total,
															proveedores: proveedores,
															proveedor: ord.proveedor,
															serie: ord.serie,
															comentario: ord.comentarios,
															estatus: ord.estatus
														});
													}
												}
											});
										}
									});
										
								}
							});
						}
					});
				}
			});
		})

		// Cancelar orden de compra
		app.get("/orden/cancelar/:id", function(solicitud, respuesta){
			var data = {
				estatus: 'Cancelada'
			}

			Ordenes.update({"_id": solicitud.params.id}, data,function(error){
				if(error){
					console.log(error);
				} else{
					Ordenes.find( function(error, ordenes){
						if(error){
							console.log(error);
						} else {
							Proveedores.find( function(error, proveedores){
								if(error){
									console.log(error);
								} else {
									respuesta.render("Compras/ordenes/ordenes",
										{
											user: solicitud.session.user,
											orders: ordenes,
											proveedores: proveedores
										}
									);
								}
							});
						}
					});
				}
			});
		})

		// Eliminar orden de compra
		app.get("/orden/eliminar/:id", function(solicitud, respuesta){
			Ordenes.remove({"_id": solicitud.params.id}, function(error){
				if(error){
					console.log(error);
				} else {
					Ordenes.find( function(error, ordenes){
						if(error){
							console.log(error);
						} else {
							Proveedores.find( function(error, proveedores){
								if(error){
									console.log(error);
								} else {
									respuesta.render("Compras/ordenes/ordenes",
										{
											user: solicitud.session.user,
											orders: ordenes,
											proveedores: proveedores
										}
									);
								}
							});
						}
					});
				}
			});
		})

		//Ver orden de compra
		app.get("/orden/ver/:id", function(solicitud, respuesta){
			if(solicitud.session.user === undefined){
				respuesta.redirect("/");
			}else{
				Ordenes.findById({"_id": solicitud.params.id}, function(error, orden){
					if(error){
						console.log(error);
					} else {
						ArticulosOrdenes.find({"orden": orden.id}, function(error, articulos){
							if(error){
								console.log(error);
							} else {
								Proveedores.find( function(error, proveedores){
									if(error){
										console.log(error);
									} else {
										respuesta.render("Compras/ordenes/ver", {
											user: solicitud.session.user,
											busca: '',
											criterio: '',
											products: {},
											articulos: articulos,
											orden: orden.id,
											proveedores: proveedores,
											proveedor: orden.proveedor,
											subtotal: orden.subtotal,
											iva: orden.iva,
											total: orden.total,
											serie: orden.serie,
											comentario: orden.comentarios,
											estatus: orden.estatus
										});
									}
								});
							}
						});
					}
				});			
			}
		})

		// Editar orden de compra
		app.get("/orden/editar/:id", function(solicitud, respuesta){
			if(solicitud.session.user === undefined){
				respuesta.redirect("/");
			}else{
				Ordenes.findById({"_id": solicitud.params.id}, function(error, orden){
					if(error){
						console.log(error);
					} else {
						ArticulosOrdenes.find({"orden": orden.id}, function(error, articulos){
							if(error){
								console.log(error);
							} else {
								Proveedores.find( function(error, proveedores){
									if(error){
										console.log(error);
									} else {
										respuesta.render("Compras/ordenes/editar", {
											user: solicitud.session.user,
											busca: '',
											criterio: '',
											products: {},
											articulos: articulos,
											orden: orden.id,
											proveedores: proveedores,
											proveedor: orden.proveedor,
											subtotal: orden.subtotal,
											iva: orden.iva,
											total: orden.total,
											estatus: orden.estatus,
											serie: orden.serie,
											articulo: {},
											comentario: orden.comentarios
										});
									}
								});
							}
						});
					}
				});			
			}
		})

		// Editar artículo de orden
		app.get("/orden/editar/articulo/:id/:id_ord", function(solicitud, respuesta){
			Ordenes.findById({"_id": solicitud.params.id_ord}, function(error, orden){
				if(error){
					console.log(error);
				} else {
					ArticulosOrdenes.findById({"_id": solicitud.params.id}, function(error, articulo){
						if(error){
							console.log(error);
						} else {
							Proveedores.find( function(error, proveedores){
								if(error){
									console.log(error);
								} else {
									ArticulosOrdenes.find({"orden": orden.id}, function(error, articulos){
										if(error){
											console.log(error);
										} else {
											respuesta.render("Compras/ordenes/editar", {
												user: solicitud.session.user,
												busca: '',
												criterio: '',
												products: {},
												articulos: articulos,
												orden: orden.id,
												proveedores: proveedores,
												proveedor: orden.proveedor,
												subtotal: orden.subtotal,
												iva: orden.iva,
												total: orden.total,
												estatus: orden.estatus,
												serie: orden.serie,
												articulo: articulo,
												comentario: orden.comentarios
											});
										}
									});	
								}
							});
						}
					});
				}
			});
		})

		// Ordenes solo nuevas
		app.get("/compras/ordenes/nuevas", function(solicitud, respuesta){
			if(solicitud.session.user === undefined){
				respuesta.redirect("/");
			}else{
				Ordenes.find( {"estatus": "Nueva"} , function(error, ordenes){
					if(error){
						console.log(error);
					} else {
						Proveedores.find( function(error, proveedores){
							if(error){
								console.log(error);
							} else {
								respuesta.render("Compras/ordenes/editar",
									{
										user: solicitud.session.user,
										orders: ordenes,
										proveedores: proveedores
									}
								);
							}
						});
					}
				});
			}
		})

		// Actualizar datos de orden
		app.put("/orden/actualizar/:id", function(solicitud, respuesta){
			var ordUpd = {
				proveedor: solicitud.body.proveedor,
				comentarios: solicitud.body.comentario
			}

			Ordenes.update( {"_id": solicitud.params.id}, ordUpd, function(error){
				if(error){
					console.log(error);
				}else {
					Proveedores.find( function(error, proveedores){
						if(error){
							console.log(error);
						} else {
							ArticulosOrdenes.find({"orden": solicitud.params.id}, function(error, articulos){
								if(error){
									console.log(error);
								} else {
									Ordenes.findById({"_id": solicitud.params.id}, function(error, ord){
										if(error){
											console.log(error);
										} else {
											respuesta.render("Compras/ordenes/editar", {
												user: solicitud.session.user,
												busca: '',
												criterio: '',
												products: {},
												orden: ord.id,
												articulos: articulos,
												subtotal: ord.subtotal,
												iva: ord.iva,
												total: ord.total,
												proveedores: proveedores,
												proveedor: ord.proveedor,
												articulo: {},
												estatus: ord.estatus,
												serie: ord.serie,
												comentario: ord.comentarios
											});
										}
									});
								}
							});
						}
					});
				}
			})

		})

		// Actualizar artículo de una ordenshi 
		app.get("/orden/articulo/actualizar/:id/:cant/:requi", function(solicitud, respuesta){
			var subtotal = 0.00,
				iva = 0.00,
				total = 0.00,
				precioUnitario = 0.00,
				precioNeto = 0.00,
				ivaArt = 0.00;
			
			ArticulosOrdenes.findById({"_id": solicitud.params.id}, function(error, articulo){
				if(error){
					console.log(error);
				} else {
					
					precioUnitario = parseFloat(articulo.precio_unitario) / parseFloat(articulo.cantidad);
					precioNeto = parseFloat(solicitud.params.cant) * parseFloat(precioUnitario);
					ivaArt = parseFloat(precioNeto) * 0.16;

					var updArt = {
						cantidad: solicitud.params.cant,
						requisicion: solicitud.params.requi,
						precio_unitario: precioNeto,
						importe: precioNeto + ivaArt,
						iva: ivaArt
					}

					console.log(updArt);

					ArticulosOrdenes.update({"_id": solicitud.params.id}, updArt, function(error){
						if(error){
							console.log(error);
						} else {
							Proveedores.find( function(error, proveedores){
								if(error){
									console.log(error);
								} else {
									ArticulosOrdenes.find({"orden": articulo.orden}, function(error, articulos){
										if(error){
											console.log(error);
										} else {
											articulos.forEach( function(art) {
												subtotal = parseFloat(subtotal) + parseFloat(art.precio_unitario);
												iva = parseFloat(iva) +parseFloat(art.iva);
												total = parseFloat(total) + parseFloat(art.importe);
											}); 
											
											var updOrd = {
												subtotal: subtotal,
												iva: iva,
												total: total
											}											

											Ordenes.update({"_id": articulo.orden}, updOrd, function(error){
												if(error){
													console.log(error);
												} else {

													Ordenes.findById({"_id": articulo.orden}, function(error, ord){
														if(error){
															console.log(error);
														} else {
															respuesta.render("Compras/ordenes/editar", {
																user: solicitud.session.user,
																busca: '',
																criterio: '',
																products: {},
																orden: ord.id,
																articulos: articulos,
																subtotal: ord.subtotal,
																iva: ord.iva,
																total: ord.total,
																proveedores: proveedores,
																proveedor: ord.proveedor,
																articulo: {},
																estatus: ord.estatus,
																serie: ord.serie,
																comentario: ord.comentarios
															});
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		})

	/***********/

	/* PRODUCTOS */

		// Ver todos los productos
		app.get("/productos", function(solicitud, respuesta){
			if(solicitud.session.user === undefined){
				respuesta.redirect("/");
			}else{
				Productos.find(function (error, productos){
					if(error){
						console.log(error);
					}else{
						Proveedores.find( function(error, proveedores){
							if(error){
								console.log(error);
							}else{
								respuesta.render("Productos/productos",{
									user: solicitud.session.user,
									productos: productos,
									proveedores: proveedores
								});
							}
						});
					}
				});	
			}	
		})

		// Nuevo producto
		app.get("/new/producto", function(solicitud, respuesta){
			if(solicitud.session.user === undefined){
				respuesta.redirect("/");
			}else{
				Proveedores.find( function(error, proveedores){
					if(error){
						console.log(error);
					}else{
						respuesta.render("Productos/producto", {
							user: solicitud.session.user,
							proveedores: proveedores
						});
					}
				});
			}
		})

		// Agregar nuevo producto
		app.post("/producto", function(solicitud, respuesta){

			var eIva = '';

				if(solicitud.body.exentoiva == 'on')	{
					eIva = true;
				} else {
					eIva = false;
				}

			var data = {
				codigo: solicitud.body.codigo,
				unidad: solicitud.body.unidad,
				nombre: solicitud.body.nombre,
				descripcion: solicitud.body.descripcion,
				precioUnitario: solicitud.body.precioUnitario,
				exentoiva: eIva,
				iva: solicitud.body.iva,
				precioNeto: solicitud.body.precioNeto,
				proveedor: solicitud.body.proveedor,
				moneda: solicitud.body.moneda,
				fecha: obtenerfecha(),
				cantidad: 0,
				minimo: 0,
				maximo: 0,
				orden: '',
				factura: ''
			}
		
			console.log(data);

			var producto = new Productos(data);

			producto.save(function(error){
				if(error){
					console.log(error);
				}else{
					respuesta.redirect("/productos");
				}
			});
		})

		// Redireccionar al view editar producto
		app.get("/producto/editar/:id", function(solicitud, respuesta){
			Productos.findById({"_id":solicitud.params.id}, function(error, producto){
				if(error){
					console.log(error);
				}else{
					if(solicitud.session.user === undefined){
						respuesta.redirect("/");
					}else{
						Proveedores.find( function(error, proveedores){
							if(error){
								console.log(error);
							} else {
								console.log(producto);
								respuesta.render("Productos/editar",{
									user: solicitud.session.user,
									proveedores: proveedores, 
									producto: producto
								});
							}
						});
					}
				}
			});
		});

		// Eliminar producto
		app.get("/producto/eliminar/:id", function(solicitud, respuesta){
			Productos.remove({"_id": solicitud.params.id},function (error){
				if(error){
					console.log(error);
				}else{
					respuesta.redirect("/productos");
				}
			});
		});

		// Update producto
		app.put("/producto/:id", function(solicitud, respuesta){
			var data = {
				codigo: solicitud.body.codigo,
				unidad: solicitud.body.unidad,
				nombre: solicitud.body.nombre,
				descripcion: solicitud.body.descripcion,
				precioUnitario: solicitud.body.precioUnitario,
				iva: solicitud.body.iva,
				exentoiva: solicitud.body.exentoiva,
				precioNeto: solicitud.body.precioNeto,
				proveedor: solicitud.body.proveedor,
				moneda: solicitud.body.moneda
			};

			Productos.update({"_id": solicitud.params.id}, data, function (error){
				if(error){
					console.log(error);
				}else{
					respuesta.redirect("/productos");
				}
			});
		});

	/*************/

	/* REQUISICIONES */

		// Ver todas las requisiciones hechas por autorizador
		app.get("/requisiciones", function(solicitud, respuesta){
			if(solicitud.session.user === 'undefined'){
				respuesta.render("/");
			} else {
				if (solicitud.session.user.permisos == "compras"){
					Requisiciones.find({ "estatus": {$in:['Autorizada','Compra parcial']}}, function(error, requisiciones){
						if(error){
							console.log(error);
						} else {
							Usuarios.find( function(error, usuarios){
								respuesta.render("Requisiciones/requisiciones", {
									user: solicitud.session.user,
									requisiciones: requisiciones,
									usuarios: usuarios
								});
							});
						}
					});
				} else if (solicitud.session.user.permisos == 'developer' || solicitud.session.user.permisos == "admin") {
					Requisiciones.find( function(error, requisiciones){
						if(error){
							console.log(error);
						} else {
							Usuarios.find( function(error, usuarios){
								respuesta.render("Requisiciones/requisiciones", {
									user: solicitud.session.user,
									requisiciones: requisiciones,
									usuarios: usuarios
								});
							});
						}
					});
				} else if (solicitud.session.user.permisos == "usuario"){
					Requisiciones.find({ "solicita": solicitud.session.user.nombre } , function(error, requisiciones){
						if(error){
							console.log(error);
						} else {
							Usuarios.find( function(error, usuarios){
								respuesta.render("Requisiciones/requisiciones", {
									user: solicitud.session.user,
									requisiciones: requisiciones,
									usuarios: usuarios
								});
							});
						}
					});
				} else if (solicitud.session.user.permisos == "owner"){
					Requisiciones.find({ "responsable": solicitud.session.user._id } , function(error, requisiciones){
						if(error){
							console.log(error);
						} else {
							Usuarios.find( function(error, usuarios){
								respuesta.render("Requisiciones/requisiciones", {
									user: solicitud.session.user,
									requisiciones: requisiciones,
									usuarios: usuarios
								});
							});
						}
					});
				} else if (solicitud.session.user.permisos == "supervisor"){ // REVISAR BIEN QUE MOSTRARA
					Requisiciones.find( function(error, requisiciones){
						if(error){
							console.log(error);
						} else {
							Usuarios.find( function(error, usuarios){
								respuesta.render("Requisiciones/requisiciones", {
									user: solicitud.session.user,
									requisiciones: requisiciones,
									usuarios: usuarios
								});
							});
						}
					});
				}	
			}
		})

		// Ver todas las requisiciones canceladas
		app.get("/requisiciones/canceladas", function(solicitud, respuesta){
			Requisiciones.find({"estatus": "Cancelada"}, function(error, canceladas){
				if(error){
					console.log(error);
				} else {
					Usuarios.find( function(error, usuarios){
						respuesta.render("Requisiciones/requisiciones", {
							user: solicitud.session.user,
							requisiciones: canceladas,
							usuarios: usuarios
						});
					});
				}
			});
		})

		// Crear nueva requisición
		app.get("/new/requisicion", function(solicitud, respuesta){
			if(solicitud.session.user === 'undefined'){
				respuesta.render("login");
			} else {
				Usuarios.find({ "autorizador": "true" }, function(error, usuarios){
					if(error){
						console.log(error);
					} else {
						respuesta.render("Requisiciones/requisicion",{
							user: solicitud.session.user,
							req: {},
							listaRequisicion: {},
							usuarios: usuarios,
							req: {codigoRequi: 'REQ00000'}
						});
					} 
				});
			}
		})

		// Guardar requisición en BD con sus artículos agregados.
		app.post("/requisicion", function(solicitud, respuesta){
			if (solicitud.body.codigo === 'undefined'){
				var numReqs = 0;

				Requisiciones.find( function(error, requisiciones){
					if(error){
						console.log(error);
					} else {
						numReqs = requisiciones.length + 1;

						var data = {
							area: solicitud.body.area,
							modulo: solicitud.body.modulo,
							solicita: solicitud.session.user.nombre,
							responsable: solicitud.body.responsable,
							uso: solicitud.body.uso,
							estatus: 'Nueva',
							fecha: obtenerfecha(),
							hora: obtenerhora(),
							codigoRequi: 'REQ' + zfill(numReqs, 5)	
						}

						var requisicion = new Requisiciones(data);
					
						requisicion.save(function(error, result){
							if(error){
								console.log(error);
							}else{

								var prov = '';

								if(solicitud.body.proveedor == 'on')	{
									prov = true;
								} else {
									prov = false;
								}

								var data2 = {
									codigoRequisicion: result._id,
									cantidad: solicitud.body.cantidad,
									unidad: solicitud.body.unidad,
									descripcion: solicitud.body.descripcion,
									estatus: solicitud.body.estatus,
									proveedor: prov,
									nombreProveedor: solicitud.body.nombreProveedor,
									telefonoProveedor: solicitud.body.telefonoProveedor,
									correoProveedor: solicitud.body.correoProveedor
								}
					
								var articuloReq = new ArticulosRequisiciones(data2);
					
								articuloReq.save(function(error){
									if(error){
										console.log(error);
									}else{
										ArticulosRequisiciones.find({'codigoRequisicion': result._id}, function(error, listaRequisiciones){
											if(error){
												console.log(error);
											} else {
												Requisiciones.findOne({'_id': result._id}, function(error, req){
													if(error){
														console.log(error);
													} else {
														Usuarios.find( function(error, usuarios){
															if(error){
																console.log(error);
															} else {

																var i = {
																	user: solicitud.session.user,
																	req: req,
																	listaRequisicion: listaRequisiciones,
																	usuarios: usuarios
																};

																console.log(i);

																respuesta.render("Requisiciones/requisicion",{
																	user: solicitud.session.user,
																	req: req,
																	listaRequisicion: listaRequisiciones,
																	usuarios: usuarios
																});
															} 
														});
													}
												});
											}
										});
									}
								});
							}
						});
					}
				});
			} else {
				
				var prov = '';

				if(solicitud.body.proveedor == 'on')	{
					prov = true;
				} else {
					prov = false;
				}
				
				var data1 = {
					codigoRequisicion: solicitud.body.codigo,
					cantidad: solicitud.body.cantidad,
					unidad: solicitud.body.unidad,
					descripcion: solicitud.body.descripcion,
					estatus: solicitud.body.estatus,
					proveedor: prov,
					nombreProveedor: solicitud.body.nombreProveedor,
					telefonoProveedor: solicitud.body.telefonoProveedor,
					correoProveedor: solicitud.body.correoProveedor
				}
	
				var articuloReq = new ArticulosRequisiciones(data1);
	
				articuloReq.save(function(error){
					if(error){
						console.log(error);
					}else{
						ArticulosRequisiciones.find({'codigoRequisicion': solicitud.body.codigo}, function(error, listaRequisiciones){
							if(error){
								console.log(error);
							} else {
								Requisiciones.findOne({'_id': solicitud.body.codigo}, function(error, req){
									if(error){
										console.log(error);
									} else {
										Usuarios.find( function(error, usuarios){
											if(error){
												console.log(error);
											} else {
												respuesta.render("Requisiciones/requisicion",{
													user: solicitud.session.user,
													req: req,
													listaRequisicion: listaRequisiciones,
													usuarios: usuarios,
													codReq: req.codigoRequi
												});
											} 
										});
									}
								});
							}
						});
					}
				});
			}
		})

		// Autorizar requisición
		app.get("/requisicion/autorizar/:id", function(solicitud, respuesta){
			var data = {
				estatus: "Autorizada"
			}

			var id_req = solicitud.params.id;

			Requisiciones.update({"_id": id_req}, data, function(error){
				if(error){
					console.log(error);
				} else {
					Requisiciones.findById({ "_id":id_req }, function(error, req){
						Usuarios.findOne({"nombre": req.solicita}, function(error, usuario){
							var mailOptions = {
								from: 'Llaos Sist 1.0 <sistema@llaos.com>',
								to: 'jparrilla@llaos.com, jcuamea@llaos.com',
								cco: 'flopez@llaos.com',
								subject: 'Requisición autorizada',
								html: "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>"+
											"<html xmlns='http://www.w3.org/1999/xhtml'>" +
												"<head>" +
													"<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />" +
													"<title>Requisiciones LLaos 1.0</title>" +
													"<style type='text/css'>" +
														"body {margin: 0; padding: 0; min-width: 100%!important;}" +
														".content {width: 100%; max-width: 600px;}" +
														"@media only screen and (min-device-width: 601px) {" +
														"	.content {width: 600px !important;}" +
														"	.header {padding: 40px 30px 20px 30px;}" +
														"}" +
														"@media only screen and (min-device-width: 601px) {" +
														"	.content {width: 600px !important;}" +
														"	.col425 {width: 425px!important;}" +
														"	.col380 {width: 380px!important;}" +
														"}" +
														"@media only screen and (max-width: 550px), screen and (max-device-width: 550px) {" +
														"	body[yahoo] .buttonwrapper {background-color: transparent!important;}" +
														"	body[yahoo] .button a {background-color: #e05443; padding: 15px 15px 13px!important; display: block!important;}" +
														"}" +
														".col425 {width: 425px!important;}" +
														".subhead {font-size: 15px; color: #ffffff; font-family: sans-serif; letter-spacing: 10px;}" +
														".h1 {font-size: 33px; line-height: 38px; font-weight: bold;}" +
														".h1, .h2, .bodycopy {color: #153643; font-family: sans-serif;}" +
														".innerpadding {padding: 30px 30px 30px 30px; text-align: justify;}" +
														".borderbottom {border-bottom: 1px solid #f2eeed; text-align: justify;}" +
														".h2 {padding: 0 0 15px 0; font-size: 24px; line-height: 28px; font-weight: bold;}" +
														".bodycopy {font-size: 16px; line-height: 22px;  text-align: justify;}" +
														".button {text-align: center; font-size: 18px; font-family: sans-serif; font-weight: bold; padding: 0 30px 0 30px;}" +
														".button a {color: #ffffff; text-decoration: none;}" +
														".footer {padding: 20px 30px 15px 30px;}" +
														".footercopy {font-family: sans-serif; font-size: 14px; color: #ffffff;}" +
														".footercopy a {color: #ffffff; text-decoration: underline;}" +
													"</style>" +
												"</head>" +
												"<body yahoo bgcolor='#f6f8f1'>" +
													"<table width='100%' bgcolor='#f6f8f1' border='0' cellpadding='0' cellspacing='0'>" +
														"<tr>" +
															"<td>" +
																"<!--[if (gte mso 9)|(IE)]>" +
																"<table width='600' align='center' cellpadding='0' cellspacing='0' border='0'>" +
																	"<tr>" +
																		"<td>" +
																			"<![endif]-->" +
																			"<table class='content' align='center' cellpadding='0' cellspacing='0' border='0'>" +
																				"<!-- HEADER -->" +
																				"<tr>" +
																					"<td class='header' bgcolor='#c7d8a7'>" +
																						"<table width='70' align='left' border='0' cellpadding='0' cellspacing='0'>" +
																							"<tr>" +
																								"<td height='70' style='padding: 0 20px 20px 0;'>" +
																									"<img src='cid:unique@headerMail' width='70' height='70' border='0' alt='' / >" +
																								"</td>" +
																							"</tr>" +
																						"</table>" +
																						"<!--[if (gte mso 9)|(IE)]>" +
																						"<table width='425' align='left' cellpadding='0' cellspacing='0' border='0'>" +
																							"<tr>" +
																								"<td>" +
																								"<![endif]-->" +
																									"<table class='col425' align='left' border='0' cellpadding='0' cellspacing='0' style='width: 100%; max-width: 425px;'>" +
																										"<tr>" +
																											"<td height='70'>" +
																												"<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
																													"<tr>" +
																														"<td class='subhead' style='padding: 0 0 0 3px;'>" +
																														"	LLAOS 1.0" +
																														"</td>" +
																													"</tr>" +
																													"<tr>" +
																														"<td class='h1' style='padding: 5px 0 0 0;'>" +
																														"	Requisiciones" +
																														"</td>" +
																													"</tr>" +
																												"</table>" +
																											"</td>" +
																										"</tr>" +
																									"</table>" + 
																								"<!--[if (gte mso 9)|(IE)]>" +
																								"</td>" +
																							"</tr>" +
																						"</table>" +
																						"<![endif]-->" +
																					"</td>" +
																				"</tr>" +
																				"<!-- CONTENIDO 1 -->" +
																				"<tr>" +
																					"<td class='innerpadding borderbottom'>" +
																						"<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
																							"<tr>" +
																								"<td class='h2'>" +
																								"	Estimado usuario:" +
																								"</td>" +
																							"</tr>" +
																							"<tr>" +
																								"<td class='bodycopy'>" +
																								"	La solicitud de requisición con el código <strong>" + req.id + "</strong> para el área de <strong>" + req.area + "</strong> y que se " +  
																								" 	utilizara en <strong>" + req.uso + "</strong>, ha sido autorizada. Para ver la requisición puede entrar al sistema y verificarla." +
																								"</td>" +
																							"</tr>" +
																							"<tr>" +
																								"<td style='padding: 20px 0 0 0;'>" +
																									"<table class='buttonwrapper' bgcolor='#e05443' border='0' cellspacing='0' cellpadding='0'>" +
																										"<tr>" +
																											"<td class='button' height='45'>" +
																											"<a href='" + pag_sistema + "'>Ir al sistema</a>" +
																											"</td>" +
																										"</tr>" +
																									"</table>" +
																								"</td>" +
																							"</tr>" +
																						"</table>" +
																					"</td>" +
																				"</tr>" +
																				"<!-- CONTENIDO 3 -->" +
																				"<tr>" +
																					"<td class='innerpadding borderbottom'>" +
																					"	Este correo ha sido generado en automático por el sistema" +
																					"	llaos 1.0, no responda al mismo ya que no tendrá respuesta" +
																					"	alguna, si usted no es un usuario que autoriza Requisiciones" +
																					"	favor de reportar el insidente al departamento de sistemas." +
																					"<br>" +
																					"<br>" +
																					"	Cualquier problema para abrir la requisición o el sistema" +
																					"	favor de reportar al departamento de sistemas." +
																					"</td>" +
																				"</tr>" +
																				"<!-- FOOTER -->" +
																				"<tr>" +
																					"<td class='footer' bgcolor='#44525f'>" +
																						"<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
																							"<tr>" +
																								"<td align='center' class='footercopy'>" +
																								"	&reg; Llaos Acuacultura S.A. de C.V. " + new Date().getFullYear() +
																								"</td>" +
																							"</tr>" +
																						"</table>" +
																					"</td>" +
																				"</tr>" +
																			"</table>" +
																			"<!--[if (gte mso 9)|(IE)]>" +
																		"</td>" +
																	"</tr>" +
																"</table>" +
																"<![endif]-->" +
															"</td>" +
														"</tr>" +
													"</table>" +
												"</body>" +
											"</html>",
								attachments:[
									{
										fileName: 'mail.png',
										path: './public/imgs/mail.png',
										cid: 'unique@headerMail'
									},
								]
							}
						
							smtpTransport.sendMail(mailOptions, function(error,res){
								if(error){
									console.log(error);
									return false;
								}else{
									console.log(res)
									Requisiciones.find( function(error, requisiciones){
										if(error){
											console.log(error);
										} else {
											if (solicitud.session.user.permisos == "compras"){
												Requisiciones.find({ "estatus": {$in:['Autorizada','Compra parcial']}}, function(error, requisiciones){
													if(error){
														console.log(error);
													} else {
														Usuarios.find( function(error, usuarios){
															respuesta.render("Requisiciones/requisiciones", {
																user: solicitud.session.user,
																requisiciones: requisiciones,
																usuarios: usuarios
															});
														});
													}
												});
											} else {
												console.log(solicitud.session.user._id);
												Requisiciones.find({ "responsable": solicitud.session.user._id } , function(error, requisiciones){
													if(error){
														console.log(error);
													} else {
														Usuarios.find( function(error, usuarios){
															respuesta.render("Requisiciones/requisiciones", {
																user: solicitud.session.user,
																requisiciones: requisiciones,
																usuarios: usuarios
															});
														});
													}
												});
											}	
										}
									});
									console.log("Correo enviado!")
									return true;
								}
								smtpTransport.close();
							});
						
						});
					});
				}
			});
		})

		// Cancelar requisición
		app.get("/requisicion/cancelar/:id", function(solicitud, respuesta){
			var data = {
				estatus: "Cancelada"
			}

			Requisiciones.update({"_id": solicitud.params.id}, data, function(error){
				if(error){
					console.log(error);
				} else {
					if (solicitud.session.user.permisos == "compras"){
						Requisiciones.find({ "estatus": {$in:['Autorizada','Compra parcial']}}, function(error, requisiciones){
							if(error){
								console.log(error);
							} else {
								Usuarios.find( function(error, usuarios){
									respuesta.render("Requisiciones/requisiciones", {
										user: solicitud.session.user,
										requisiciones: requisiciones,
										usuarios: usuarios
									});
								});
							}
						});
					} else {
						console.log(solicitud.session.user._id);
						Requisiciones.find({ "responsable": solicitud.session.user._id } , function(error, requisiciones){
							if(error){
								console.log(error);
							} else {
								Usuarios.find( function(error, usuarios){
									respuesta.render("Requisiciones/requisiciones", {
										user: solicitud.session.user,
										requisiciones: requisiciones,
										usuarios: usuarios
									});
								});
							}
						});
					}	
				}
			});
		})

		// Ver datos de requisición
		app.get("/requisicion/ver/:id", function(solicitud, respuesta){
			Requisiciones.findOne({"_id": solicitud.params.id}, function(error, requisicion){
				if(error){
					console.log(error);
				} else {
					ArticulosRequisiciones.find({"codigoRequisicion": requisicion.id}, function(error, articulos){
						if(error){
							console.log(error);
						} else {
							Usuarios.find( function(error, usuarios){
								if(error){
									console.log(errro);
								} else {
									respuesta.render("Requisiciones/view",{
										req: requisicion,
										user: solicitud.session.user,
										listaRequisicion: articulos,
										usuarios: usuarios,
										codReq: requisicion.codigoRequi
									});
								}
							});
						}
					})
				}
			});
		})

		// Ver datos de requisición redireccionado desde correo
		app.get("/requisicion/ver/:id/:id_usr", function(solicitud, respuesta){
			Usuarios.findById({"_id": solicitud.params.id_usr}, function(error, user){
				if(error){
					console.log(error);
				}else{
					// Crear sesión
					solicitud.session.user = user;
					Requisiciones.findOne({"_id": solicitud.params.id}, function(error, requisicion){
						if(error){
							console.log(error);
						} else {
							ArticulosRequisiciones.find({"codigoRequisicion": requisicion.id}, function(error, articulos){
								if(error){
									console.log(error);
								} else {
									Usuarios.find( function(error, usuarios){
										if(error){
											console.log(error);
										} else {
											respuesta.render("Requisiciones/view",{
												req: requisicion,
												user: user,
												listaRequisicion: articulos,
												usuarios: usuarios,
												codReq: requisicion.codigoRequi
											});
										}
									});
								}
							})
						}
					});
				}
			});
		})

		// Editar datos de requisición
		app.get("/requisicion/editar/:id", function(solicitud, respuesta){
			Requisiciones.findOne({"_id": solicitud.params.id}, function(error, requisicion){
				if(error){
					console.log(error);
				} else {
					ArticulosRequisiciones.find({"codigoRequisicion": requisicion.id}, function(error, articulos){
						if(error){
							console.log(error);
						} else {
							Usuarios.find({ "autorizador": true }, function(error, usuarios){
								if(error){
									console.log(error);
								} else {
									respuesta.render("Requisiciones/editar",{
										req: requisicion,
										user: solicitud.session.user,
										listaRequisicion: articulos,
										articulo: {},
										usuarios: usuarios,
										codReq: requisicion.codigoRequi
									});
								}
							});
						}
					})
				}
			});
		})

		// Editar artículo agregado a requisición
		app.get("/editar/articulo-requisicion/:id/:req_id", function(solicitud, respuesta){
			Requisiciones.findOne({"_id": solicitud.params.req_id}, function(error, requisicion){
				if(error){
					console.log(error);
				} else {
					ArticulosRequisiciones.find({"codigoRequisicion": requisicion.id}, function(error, articulos){
						if(error){
							console.log(error);
						} else {
							ArticulosRequisiciones.findOne({"_id": solicitud.params.id}, function(error, articulo){
								if(error){
									console.log(error);
								} else {
									Usuarios.find({ "autorizador": true }, function(error, usuarios){
										if(error){
											console.log(error);
										} else {
											respuesta.render("Requisiciones/editar",{
												req: requisicion,
												user: solicitud.session.user,
												listaRequisicion: articulos,
												articulo: articulo,
												usuarios: usuarios,
												codReq: requisicion.codigoRequi,
												updArt: true
											});
										}
									});
								}
							});
						}
					})
				}
			});
		})

		// Actualizar solo requisición
		app.put("/actualizar/requisicion/:id", function(solicitud, respuesta){
			var data = { 
				area: solicitud.body.area,
				modulo: solicitud.body.modulo,
				responsable: solicitud.body.responsable,
				estatus: solicitud.body.status,
				uso: solicitud.body.uso
			}

			console.log(data);

			Requisiciones.update({"_id": solicitud.params.id}, data, function(error){
				if(error){
					console.log(error);
				} else {
					if (solicitud.session.user.permisos == "compras"){
						Requisiciones.find({ "estatus": {$in:['Autorizada','Compra parcial']}}, function(error, requisiciones){
							if(error){
								console.log(error);
							} else {
								Usuarios.find( function(error, usuarios){
									respuesta.render("Requisiciones/requisiciones", {
										user: solicitud.session.user,
										requisiciones: requisiciones,
										usuarios: usuarios
									});
								});
							}
						});
					} else {
						Requisiciones.find({ "responsable": solicitud.session.user._id } , function(error, requisiciones){
							if(error){
								console.log(error);
							} else {
								Usuarios.find( function(error, usuarios){
									respuesta.render("Requisiciones/requisiciones", {
										user: solicitud.session.user,
										requisiciones: requisiciones,
										usuarios: usuarios
									});
								});
							}
						});
					}	
				}
			});
		})

		// Actualizar requisición y artículo en requisición
		app.put("/actualizar/requisicion/:req_id/:art_id", function(solicitud, respuesta){
			var dataReq = { 
				area: solicitud.body.area,
				modulo: solicitud.body.modulo,
				responsable: solicitud.body.responsable,
				estatus: solicitud.body.status,
				uso: solicitud.body.uso,
			}

			var dataArt = {
				codigoRequisicion: solicitud.body.codigo,
				cantidad: solicitud.body.cantidad,
				unidad: solicitud.body.unidad,
				descripcion: solicitud.body.descripcion,
				estatus: solicitud.body.estatus,
				proveedor: solicitud.body.proveedor,
				nombreProveedor: solicitud.body.nombreProveedor,
				telefonoProveedor: solicitud.body.telefonoProveedor,
				correoProveedor: solicitud.body.correo
			}

			Requisiciones.update({"_id": solicitud.params.req_id}, dataReq, function(error){
				if(error){
					console.log(error);
				} else {
					if(solicitud.params.art_id === 'undefined'){
						var articuloReq = new ArticulosRequisiciones(dataArt);
	
						articuloReq.save(function(error){
							if(error){
								console.log(error);
							}else{
								ArticulosRequisiciones.find({'codigoRequisicion': solicitud.body.codigo}, function(error, listaRequisiciones){
									if(error){
										console.log(error);
									} else {
										Requisiciones.findById({ "_id": solicitud.body.codigo}, function(error, requisicion){
											if(error){
												console.log(error);
											} else {
												Usuarios.find({ "autorizador": true }, function(error, usuarios){
													respuesta.render("Requisiciones/editar",{
														req: requisicion,
														user: solicitud.session.user,
														listaRequisicion: listaRequisiciones,
														articulo: {},
														usuarios: usuarios,
														codReq: requisicion.codigoRequi
													});
												});
											}
										});
									}
								});
							}
						});
					} else {
						ArticulosRequisiciones.update({"_id": solicitud.params.art_id}, dataArt, function(error){
							if(error){
								console.log(error);
							}else{
								ArticulosRequisiciones.find({'codigoRequisicion': solicitud.body.codigo}, function(error, listaRequisiciones){
									if(error){
										console.log(error);
									} else {
										Requisiciones.findById({ "_id": solicitud.body.codigo}, function(error, requisicion){
											if(error){
												console.log(error);
											} else {
												Usuarios.find({ "autorizador": true }, function(error, usuarios){
													respuesta.render("Requisiciones/editar",{
														req: requisicion,
														user: solicitud.session.user,
														listaRequisicion: listaRequisiciones,
														articulo: {},
														usuarios: usuarios,
														codReq: requisicion.codigoRequi
													});
												});
											}
										});
									}
								});
							}
						});
					}
				}
			});
		})

		// Enviar correo de nueva requisición
		app.get("/enviar/requisicion/:id/:id_usr_aut", function(solicitud, respuesta){
			Requisiciones.findById({"_id": solicitud.params.id}, function(error, requisicion){
				if(error){
					console.log(error);
				}else{
					Usuarios.findById({"_id": solicitud.params.id_usr_aut} ,function(error, autoriza){
						if(error){
							console.log(error);
						} else {
							var mailOptions = {
								from: 'Llaos Sist 1.0 <sistema@llaos.com>',
								to: autoriza.correo,//'flopez@llaos.com',
								cc: 'davilar@llaos.com',
								subject: 'Solicitud de requisición',
								html: "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>"+
											"<html xmlns='http://www.w3.org/1999/xhtml'>" +
												"<head>" +
													"<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />" +
													"<title>Requisiciones LLaos 1.0</title>" +
													"<style type='text/css'>" +
														"body {margin: 0; padding: 0; min-width: 100%!important;}" +
														".content {width: 100%; max-width: 600px;}" +
														"@media only screen and (min-device-width: 601px) {" +
														"	.content {width: 600px !important;}" +
														"	.header {padding: 40px 30px 20px 30px;}" +
														"}" +
														"@media only screen and (min-device-width: 601px) {" +
														"	.content {width: 600px !important;}" +
														"	.col425 {width: 425px!important;}" +
														"	.col380 {width: 380px!important;}" +
														"}" +
														"@media only screen and (max-width: 550px), screen and (max-device-width: 550px) {" +
														"	body[yahoo] .buttonwrapper {background-color: transparent!important;}" +
														"	body[yahoo] .button a {background-color: #e05443; padding: 15px 15px 13px!important; display: block!important;}" +
														"}" +
														".col425 {width: 425px!important;}" +
														".subhead {font-size: 15px; color: #ffffff; font-family: sans-serif; letter-spacing: 10px;}" +
														".h1 {font-size: 33px; line-height: 38px; font-weight: bold;}" +
														".h1, .h2, .bodycopy {color: #153643; font-family: sans-serif;}" +
														".innerpadding {padding: 30px 30px 30px 30px; text-align: justify;}" +
														".borderbottom {border-bottom: 1px solid #f2eeed; text-align: justify;}" +
														".h2 {padding: 0 0 15px 0; font-size: 24px; line-height: 28px; font-weight: bold;}" +
														".bodycopy {font-size: 16px; line-height: 22px;  text-align: justify;}" +
														".button {text-align: center; font-size: 18px; font-family: sans-serif; font-weight: bold; padding: 0 30px 0 30px;}" +
														".button a {color: #ffffff; text-decoration: none;}" +
														".footer {padding: 20px 30px 15px 30px;}" +
														".footercopy {font-family: sans-serif; font-size: 14px; color: #ffffff;}" +
														".footercopy a {color: #ffffff; text-decoration: underline;}" +
													"</style>" +
												"</head>" +
												"<body yahoo bgcolor='#f6f8f1'>" +
													"<table width='100%' bgcolor='#f6f8f1' border='0' cellpadding='0' cellspacing='0'>" +
														"<tr>" +
															"<td>" +
																"<!--[if (gte mso 9)|(IE)]>" +
																"<table width='600' align='center' cellpadding='0' cellspacing='0' border='0'>" +
																	"<tr>" +
																		"<td>" +
																			"<![endif]-->" +
																			"<table class='content' align='center' cellpadding='0' cellspacing='0' border='0'>" +
																				"<!-- HEADER -->" +
																				"<tr>" +
																					"<td class='header' bgcolor='#c7d8a7'>" +
																						"<table width='70' align='left' border='0' cellpadding='0' cellspacing='0'>" +
																							"<tr>" +
																								"<td height='70' style='padding: 0 20px 20px 0;'>" +
																									"<img src='cid:unique@headerMail' width='70' height='70' border='0' alt='' / >" +
																								"</td>" +
																							"</tr>" +
																						"</table>" +
																						"<!--[if (gte mso 9)|(IE)]>" +
																						"<table width='425' align='left' cellpadding='0' cellspacing='0' border='0'>" +
																							"<tr>" +
																								"<td>" +
																								"<![endif]-->" +
																									"<table class='col425' align='left' border='0' cellpadding='0' cellspacing='0' style='width: 100%; max-width: 425px;'>" +
																										"<tr>" +
																											"<td height='70'>" +
																												"<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
																													"<tr>" +
																														"<td class='subhead' style='padding: 0 0 0 3px;'>" +
																														"	LLAOS 1.0" +
																														"</td>" +
																													"</tr>" +
																													"<tr>" +
																														"<td class='h1' style='padding: 5px 0 0 0;'>" +
																														"	Solicitud de Requisiciones" +
																														"</td>" +
																													"</tr>" +
																												"</table>" +
																											"</td>" +
																										"</tr>" +
																									"</table>" + 
																								"<!--[if (gte mso 9)|(IE)]>" +
																								"</td>" +
																							"</tr>" +
																						"</table>" +
																						"<![endif]-->" +
																					"</td>" +
																				"</tr>" +
																				"<!-- CONTENIDO 1 -->" +
																				"<tr>" +
																					"<td class='innerpadding borderbottom'>" +
																						"<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
																							"<tr>" +
																								"<td class='h2'>" +
																								"	Estimado "+ autoriza.nombre +" :" +
																								"</td>" +
																							"</tr>" +
																							"<tr>" +
																								"<td class='bodycopy'>" +
																								"	El usuario <strong> " + requisicion.solicita + " </strong> acaba de realizar" +
																								"	una solicitud de requisición con el código <strong>" + requisicion.id + "</strong> en el sistema, para el área de <strong>" + requisicion.area + "</strong> y lo " +  
																								" 	utilizara en <strong>" + requisicion.uso + "</strong>, si desea realizar acción alguna a la misma, haga clic en el botón ver requisición." +
																								"</td>" +
																							"</tr>" +
																							"<tr>" +
																								"<td style='padding: 20px 0 0 0;'>" +
																									"<table class='buttonwrapper' bgcolor='#e05443' border='0' cellspacing='0' cellpadding='0'>" +
																										"<tr>" +
																											"<td class='button' height='45'>" +
																											"<a href='" + pag_sistema + "/requisicion/ver/"+ requisicion.id +"/" + autoriza.id + "'>Ver requisición</a>" +
																											"</td>" +
																										"</tr>" +
																									"</table>" +
																								"</td>" +
																							"</tr>" +
																						"</table>" +
																					"</td>" +
																				"</tr>" +
																				"<!-- CONTENIDO 3 -->" +
																				"<tr>" +
																					"<td class='innerpadding borderbottom'>" +
																					"	Este correo ha sido generado en automático por el sistema" +
																					"	llaos 1.0, no responda al mismo ya que no tendrá respuesta" +
																					"	alguna, si usted no es un usuario que autoriza Requisiciones" +
																					"	favor de reportar el insidente al departamento de sistemas." +
																					"<br>" +
																					"<br>" +
																					"	Cualquier problema para abrir la requisición o el sistema" +
																					"	favor de reportar al departamento de sistemas." +
																					"</td>" +
																				"</tr>" +
																				"<!-- FOOTER -->" +
																				"<tr>" +
																					"<td class='footer' bgcolor='#44525f'>" +
																						"<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
																							"<tr>" +
																								"<td align='center' class='footercopy'>" +
																								"	&reg; Llaos Acuacultura S.A. de C.V. " + new Date().getFullYear() + 
																								"</td>" +
																							"</tr>" +
																						"</table>" +
																					"</td>" +
																				"</tr>" +
																			"</table>" +
																			"<!--[if (gte mso 9)|(IE)]>" +
																		"</td>" +
																	"</tr>" +
																"</table>" +
																"<![endif]-->" +
															"</td>" +
														"</tr>" +
													"</table>" +
												"</body>" +
											"</html>",
								attachments:[
									{
										fileName: 'mail.png',
										path: './public/imgs/mail.png',
										cid: 'unique@headerMail'
									},
								]
							}

							smtpTransport.sendMail(mailOptions, function(error,res){
								if(error){
									console.log(error);
								}else{
									console.log(res)
									if (solicitud.session.user.permisos == "compras"){
										Requisiciones.find({ "estatus": {$in:['Autorizada','Compra parcial']}}, function(error, requisiciones){
											if(error){
												console.log(error);
											} else {
												Usuarios.find( function(error, usuarios){
													respuesta.render("Requisiciones/requisiciones", {
														user: solicitud.session.user,
														requisiciones: requisiciones,
														usuarios: usuarios
													});
												});
											}
										});
									} else {	
										Requisiciones.find({ "solicita": solicitud.session.user.nombre } , function(error, requisiciones){
											if(error){
												console.log(error);
											} else {
												Usuarios.find( function(error, usuarios){
													respuesta.render("Requisiciones/requisiciones", {
														user: solicitud.session.user,
														requisiciones: requisiciones,
														usuarios: usuarios
													});
												});
											}
										});
									}
									console.log("Correo enviado!")
								}
								smtpTransport.close();
							});
						} 
					});
				}
			})
		})

		// Eliminar requisicion
		app.get("/requisicion/eliminar/:id", function(solicitud, respuesta){
			Requisiciones.remove({"_id": solicitud.params.id}, function(error){
				if(error){
					console.log(error);
				} else {
					if (solicitud.session.user.permisos == "compras"){
						Requisiciones.find({ "estatus": {$in:['Autorizada','Compra parcial']}}, function(error, requisiciones){
							if(error){
								console.log(error);
							} else {
								Usuarios.find( function(error, usuarios){
									respuesta.render("Requisiciones/requisiciones", {
										user: solicitud.session.user,
										requisiciones: requisiciones,
										usuarios: usuarios
									});
								});
							}
						});
					} else {
						console.log(solicitud.session.user._id);
						Requisiciones.find({ "responsable": solicitud.session.user._id } , function(error, requisiciones){
							if(error){
								console.log(error);
							} else {
								Usuarios.find( function(error, usuarios){
									respuesta.render("Requisiciones/requisiciones", {
										user: solicitud.session.user,
										requisiciones: requisiciones,
										usuarios: usuarios
									});
								});
							}
						});
					}	
				}
			});
		})

		// Eliminar artículo de requisición
		app.get("/eliminar/articulo-requisicion/:id", function(solicitud, respuesta){
			var codigo_Req = '';

			ArticulosRequisiciones.findById({"_id": solicitud.params.id}, function(error, articulo){
				if(error){
					console.log(error);
				} else {
					codigo_Req = articulo.codigoRequisicion ;

					ArticulosRequisiciones.remove({"_id": solicitud.params.id}, function(error){
						if(error){
							console.log(error);
						} else {
							ArticulosRequisiciones.find({'codigoRequisicion': codigo_Req}, function(error, listaRequisiciones){
								if(error){
									console.log(error);
								} else {
									Requisiciones.findOne({'_id': codigo_Req}, function(error, req){
										if(error){
											console.log(error);
										} else {
											Usuarios.find( function(error, usuarios){
												if(error){
													console.log(error);
												} else {
													respuesta.render("Requisiciones/editar",{
														user: solicitud.session.user,
														req: req,
														articulo: {},
														listaRequisicion: listaRequisiciones,
														usuarios: usuarios,
														codReq: req.codigoRequi
													});
												} 
											});
										}
									});
								}
							});
						}
					});
				}
			});

			
		})

		// Requisiciones solo nuevas pero que ya fueron autorizadas
		app.get("/requisiciones/nuevas", function(solicitud, respuesta){
			if(solicitud.session.user === 'undefined'){
				respuesta.render("/");
			} else {
				if(solicitud.session.user.permisos == 'developer'){
					Requisiciones.find( function(error, requisiciones){
						if(error){
							console.log(error);
						} else {
							Usuarios.find( function(error, usuarios){
								respuesta.render("Requisiciones/requisiciones", {
									user: solicitud.session.user,
									requisiciones: requisiciones,
									usuarios: usuarios
								});
							});
						}
					});	
				} else {
					Requisiciones.find({ "estatus": "Autorizada" } , function(error, requisiciones){
						if(error){
							console.log(error);
						} else {
							Usuarios.find( function(error, usuarios){
								respuesta.render("Requisiciones/requisiciones", {
									user: solicitud.session.user,
									requisiciones: requisiciones,
									usuarios: usuarios
								});
							});
						}
					});	
				}		
			}
		})

		app.get("/pdf/requisiciones", function(solicitud, respuesta){
			Requisiciones.find(  function(error, requisiciones){
				ArticulosRequisiciones.find( function(error, articulos){
					if(error){
						console.log(error);
					} else {
						// Crear el documento
						doc = new pdf({
							// Establecer tamaño de hoja
							size: 'letter',
							layout: 'landscape'
						});
					
						// Logo empresa
						doc.image('./public/imgs/logo.png', 5, 40,{width: 200})
						
						// Nombre empresa y rfc
						doc.font('fonts/Roboto-Black.ttf')
						.fontSize(14)
						.text('LLAOS ACUACULTURA S.A. de C.V.', 480, 40, { align: 'right', width: 290 })
						.text('REQUISICIONES SEMANALES', { align: 'right', width: 290 })
						
						// Nombre formato, fecha y hora de creación
						doc.font('fonts/Roboto-Regular.ttf')
						.fontSize(14)
						.text("Fecha: "+ obtenerfecha() + " - Hora: " + obtenerhora(),{ align: 'right' , width: 290})
																														
						// Encabezados tabla
						doc.lineWidth(25)
						doc.lineCap('butt')
						.fillColor("blue")
						.moveTo(15, 150)
						.lineTo(780, 150)
						.stroke()
					
						doc.fontSize(10)
						.fill('white')
						.text("Cant", 17, 140, {align: 'center', width: 45})
						.text("Unidad", 49, 140,  {align: 'center', width: 70})
						.text("Descripción",69, 140, {align: 'center', width: 250})
						.text("Solicitante",419, 140, {align: 'center', width: 100})
						.text("Urgencia",604, 140, {align: 'center', width: 55})
						.text("Requisición",629, 140, {align: 'center', width: 80})
						.text("Fecha",709, 140, {align: 'center', width: 80})
					
						// Llenado de tabla
						var y = 155;
						var total = 0;

						articulos.forEach( function(art) {
							requisiciones.forEach( function(req) {
								if(req.id == art.codigoRequisicion){
									total = total + 1;
									y += 10;

									if (y > 525){
										y = 165;

										doc.addPage()

										// Logo empresa
										doc.image('./public/imgs/logo.png', 5, 40,{width: 200})
										
										// Nombre empresa y rfc
										doc.font('fonts/Roboto-Black.ttf')
										.fontSize(14)
										.text('LLAOS ACUACULTURA S.A. de C.V.', 480, 40, { align: 'right', width: 290 })
										.text('REQUISICIONES SEMANALES', { align: 'right', width: 290 })
										
										// Nombre formato, fecha y hora de creación
										doc.font('fonts/Roboto-Regular.ttf')
										.fontSize(14)
										.text("Fecha: "+ obtenerfecha() + " - Hora: " + obtenerhora(),{ align: 'right' , width: 290})
																																		
										// Encabezados tabla
										doc.lineWidth(25)
										doc.lineCap('butt')
										.fillColor("blue")
										.moveTo(15, 150)
										.lineTo(780, 150)
										.stroke()
									
										doc.fontSize(10)
										.fill('white')
										.text("Cant", 17, 140, {align: 'center', width: 45})
										.text("Unidad", 49, 140,  {align: 'center', width: 70})
										.text("Descripción",69, 140, {align: 'center', width: 250})
										.text("Solicitante",419, 140, {align: 'center', width: 100})
										.text("Urgencia",604, 140, {align: 'center', width: 55})
										.text("Requisición",629, 140, {align: 'center', width: 80})
										.text("Fecha",709, 140, {align: 'center', width: 80})
									}
										doc.fillColor('black')
										.text(art.cantidad, 10, y, {align: 'center', width: 45})
										.text(art.unidad, 49, y,  {align: 'center', width: 70})
										.text(art.descripcion, 124, y, {align: 'left', width: 300, height: 15})
										.text(req.solicita, 424, y, {align: 'center', width: 150})
										.text(art.estatus, 564, y, {align: 'center', width: 75})
										.text(req.codigoRequi, 634, y, {align: 'center', width: 80})
										.text(req.fecha, 709, y, {align: 'center', width: 80})
								}
							});
						});
										
						// División productos y totales
						doc.lineWidth(2)
						doc.lineCap('butt')
						.moveTo(15, y + 15)
						.lineTo(780, y + 15)
						.stroke()
						
						// Conciciones / Observaciones / Comentarios
						doc.font('fonts/Roboto-Black.ttf')
						.text("No. artículos solicitados: " + total, 15, y + 15, { align: 'left', width: 400 })

						// Creación del documento y guardado

						var nombre_archivo = './files/requisiciones.pdf';

						console.log(nombre_archivo);

						doc.pipe(fs.createWriteStream(nombre_archivo)).on('finish', function (){
							console.log('PDF closed');
						});

						// Finalize PDF file
						doc.end();

						respuesta.download(__dirname + '/files/requisiciones.pdf', function(error){
							if(error){
								console.log(error);
							}	
						});
						
					}
				});
			});
		})

	/*****************/
	
	/* USUARIOS */
		
		// Ver todos los usuarios
		app.get("/usuarios", function(solicitud, respuesta){
			Usuarios.find( function(error, usuarios){
				if(error){

				} else {
					respuesta.render("Sistemas/Usuarios/usuarios",
						{ 
							user: solicitud.session.user,
						  	usuarios: usuarios
						}
					);
				}
			});	
		})

		// Agregar un nuevo usuario
		app.get("/new/usuario", function(solicitud, respuesta){
			respuesta.render("Sistemas/Usuarios/usuario",
				{
					user: solicitud.session.user
				}
			);
		})

		// Mostrar edición de usuario
		app.get("/editar/usuario/:id", function(solicitud, respuesta){
			Usuarios.findOne({"_id": solicitud.params.id}, function(error,usuario){
				if(error){
					console.log(error);
				} else {
					respuesta.render("Sistemas/Usuarios/editar",
						{
							user: solicitud.session.user,
							usr: usuario,
						}
					);
				}
			});
		})

		// Guardar usuario en bd
		app.post("/usuario", function(solicitud, respuesta){

			var autorizador = '';

			if (solicitud.body.autoriza == 'on'){
				autorizador = true;
			} else {
				autorizador = false;
			}

			var data = {
				nombre: solicitud.body.nombre,
				correo: solicitud.body.correo,
				usuario: solicitud.body.usuario,
				password: solicitud.body.password,
				nacimiento: solicitud.body.nacimiento,
				numero_nomina: solicitud.body.numero_nomina,
				empresa: solicitud.body.empresa,
				unidad_negocio: solicitud.body.unidad_negocio,
				permisos: solicitud.body.permisos,
				autorizador: autorizador
			}

			console.log(data);

			var usuario = new Usuarios(data);

			usuario.save(function(error){
				if(error){
					console.log(error);
				}else{
					Usuarios.find( function(error, usuarios){
						if(error){
		
						} else {
							respuesta.render("Sistemas/Usuarios/usuarios",
								{ 
									user: solicitud.session.user,
									usuarios: usuarios
								}
							);
						}
					});	
				}
			});
		})

		// Actualizar usuario en bd
		app.put("/editar/usuario/:id", function(solicitud, respuesta){
			var data = {
				nombre: solicitud.body.nombre,
				correo: solicitud.body.correo,
				usuario: solicitud.body.usuario,
				password: solicitud.body.password,
				nacimiento: solicitud.body.nacimiento,
				numero_nomina: solicitud.body.numero_nomina,
				empresa: solicitud.body.empresa,
				unidad_negocio: solicitud.body.unidad_negocio,
				permisos: solicitud.body.permisos,
				autorizador: solicitud.body.autoriza
			}

			console.log(data);

			Usuarios.update({"_id": solicitud.params.id}, data, function(error){
				if(error){
					console.log(error);
				} else {
					Usuarios.find( function(error, usuarios){
						if(error){
							console.log(error);
						} else {
							respuesta.render("Sistemas/Usuarios/Usuarios",
								{
									user: solicitud.session.user,
									usuarios: usuarios
								}
							);
						}
					});
				}
			});

		})

		// Eliminar usuario de bd
		app.get("/eliminar/usaurio/:id", function(solicitud, respuesta){
			Usuarios.remove({"_id": solicitud.params.id}, function(error){
				if(error){
					console.log(error);
				} else {
					Usuarios.find( function(error, usuarios){
						if(error){
							console.log(error);
						} else {
							respuesta.render("Sistemas/Usuarios/Usuarios",
								{
									user: solicitud.session.user,
									usuarios: usuarios
								}
							);
						}
					});
				}
			});
		})

	/************/

	/* EXTERNOS */

		// Mostrar todas la cotizaciones
		app.get("/externos/cotizaciones", function(solicitud, respuesta){
			if(solicitud.session.user === 'undefined'){
				respuesta.redirect("/");
			}else{
				Cotizaciones.find( function(error, cotizaciones){
					if(error){
						console.log(error);
					} else {
						respuesta.render("Externos/Cotizaciones/cotizaciones",
							{
								user: solicitud.session.user,
								cotizaciones: cotizaciones
							}
						);
					}
				});
			}
		})

		// Crar nueva cotización
		app.get("/externos/cotizacion/new", function(solicitud, respuesta){
			if(solicitud.session.user === undefined){
				respuesta.redirect("/");
			} else {
				respuesta.render("Externos/Cotizaciones/cotizacion",
					{
						user: solicitud.session.user,
						articulos: {},
						cotizacion: '',
						subtotal: '',
						iva: '',
						total: '',
						codigo_cot: '',
						proveedor: '',
						vigencia: '',
						observaciones: '',
						moneda: '',
						tipoCambio: ''
					}
				);
			}
		})

		// Agregar articulo a cotización
		app.post("/cotizacion/articulo/agregar", function(solicitud, respuesta){

			if (solicitud.body.codigo_id === 'undefined' || solicitud.body.codigo_id == null || solicitud.body.codigo_id == ''){
				var dataCot = {
					codigo: solicitud.body.codigo_cotizacion,
					proveedor: solicitud.body.proveedor,
					subtotal: '0.00',
					iva: '0.00',
					total: '0.00',
					estatus: 'Nueva',
					fecha: obtenerfecha(),
					hora: obtenerhora(),
					vigencia: solicitud.body.vigencia,
					observaciones: solicitud.body.observaciones,
					moneda: solicitud.body.moneda,
					tipoCambio: solicitud.body.tipoCambio,
					banco: solicitud.body.banco,
					cuenta: solicitud.body.cuenta,
					clabe: solicitud.body.clabe
				}

				var cotizacion = new Cotizaciones(dataCot);
	
				cotizacion.save( function(error, coti){
					if(error){
						console.log(error);
					} else {
						var data = {
							codigo: solicitud.body.codigo,
							cotizacion: coti.id,
							cantidad: solicitud.body.cantidad,
							unidad: solicitud.body.unidad,
							descripcion: solicitud.body.descripcion,
							precioUnitario: solicitud.body.precioUnitario,
							iva: solicitud.body.iva,
							precioNeto: solicitud.body.importe,
							tiempoEntrega: solicitud.body.tiempoEntrega
						}
			
						var articuloCotizacion = new ArticulosCotizaciones(data);
			
						articuloCotizacion.save( function(error) {
							if(error){
								console.log(error);
							} else {
								ArticulosCotizaciones.find({"cotizacion": coti.id}, function(error, articulos){
									respuesta.render("Externos/Cotizaciones/cotizacion",
										{
											user: solicitud.session.user,
											articulos: articulos,
											cotizacion: coti.id,
											codigo_cot: coti.codigo,
											subtotal: parseFloat(solicitud.body.precioUnitario * solicitud.body.cantidad).toFixed(2),
											iva: parseFloat(solicitud.body.iva).toFixed(2),
											total: parseFloat(solicitud.body.importe).toFixed(2),
											proveedor: solicitud.body.proveedor,
											vigencia: solicitud.body.vigencia,
											observaciones: solicitud.body.observaciones
										}
									);
								})
							}
						});
					}
				});
			} else {
				var data = {
					codigo: solicitud.body.codigo,
					cotizacion: solicitud.body.codigo_id,
					cantidad: solicitud.body.cantidad,
					unidad: solicitud.body.unidad,
					descripcion: solicitud.body.descripcion,
					precioUnitario: solicitud.body.precioUnitario,
					iva: solicitud.body.iva,
					precioNeto: solicitud.body.importe,
					tiempoEntrega: solicitud.body.tiempoEntrega
				}
	
				var articuloCotizacion = new ArticulosCotizaciones(data);
	
				articuloCotizacion.save( function(error) {
					if(error){
						console.log(error);
					} else {
						ArticulosCotizaciones.find({"cotizacion": solicitud.body.codigo_id}, function(error, articulos){
							
							var subtotal = 0.00;
							var iva = 0.00;
							var total = 0.00;
							
							articulos.forEach( function(art) {
								subtotal = parseFloat(subtotal) + parseFloat(parseFloat(art.cantidad) * parseFloat(art.precioUnitario));
								iva = parseFloat(iva) + parseFloat(parseFloat(art.cantidad) * parseFloat(art.iva));
								total = parseFloat(total) + parseFloat(parseFloat(art.cantidad) * parseFloat(art.precioNeto));
							});

							var updTotales = {
								subtotal: parseFloat(subtotal).toFixed(2),
								iva: parseFloat(iva).toFixed(2),
								total: parseFloat(total).toFixed(2)
							}
					
							Cotizaciones.update({"_id": solicitud.body.codigo_id}, updTotales, function(error, cot){
								if(error){
									console.log(error);
								} else {
									Cotizaciones.findById({"_id": solicitud.body.codigo_id}, function(error, coti){
										if(error){
											console.log(error);
										} else {
											respuesta.render("Externos/Cotizaciones/cotizacion",
												{
													user: solicitud.session.user,
													articulos: articulos,
													cotizacion: coti.id,
													codigo_cot: coti.codigo,
													subtotal: parseFloat(coti.subtotal).toFixed(2),
													iva: parseFloat(coti.iva).toFixed(2) ,
													total:parseFloat(coti.total).toFixed(2),
													proveedor: solicitud.body.proveedor,
													vigencia: solicitud.body.vigencia,
													observaciones: solicitud.body.observaciones
												}
											);
										}
									});
									
								}
							});
						})
					}
				});
			}
		})

		// Enviar cotización 
		app.get("/cotizacion/enviar/:id/:tipo", function(solicitud, respuesta){
			Cotizaciones.findById({"_id": solicitud.params.id}, function(error, cotizacion){
				if(error){
					consolo.log(error);
				} else {
					// ENVIAR CORRREO
					var mailOptions = {
						from: 'Llaos Sist 1.0 <sistema@llaos.com>',
						to: "flopez@llaos.com", //jparrilla@llaos.com
						//cc: "jcuamea@llaos.com",
						subject: 'Cotización COT-' + cotizacion.codigo,
						html: "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>"+
									"<html xmlns='http://www.w3.org/1999/xhtml'>" +
										"<head>" +
											"<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />" +
											"<title>Requisiciones LLaos 1.0</title>" +
											"<style type='text/css'>" +
												"body {margin: 0; padding: 0; min-width: 100%!important;}" +
												".content {width: 100%; max-width: 600px;}" +
												"@media only screen and (min-device-width: 601px) {" +
												"	.content {width: 600px !important;}" +
												"	.header {padding: 40px 30px 20px 30px;}" +
												"}" +
												"@media only screen and (min-device-width: 601px) {" +
												"	.content {width: 600px !important;}" +
												"	.col425 {width: 425px!important;}" +
												"	.col380 {width: 380px!important;}" +
												"}" +
												"@media only screen and (max-width: 550px), screen and (max-device-width: 550px) {" +
												"	body[yahoo] .buttonwrapper {background-color: transparent!important;}" +
												"	body[yahoo] .button a {background-color: #e05443; padding: 15px 15px 13px!important; display: block!important;}" +
												"}" +
												".col425 {width: 425px!important;}" +
												".subhead {font-size: 15px; color: #ffffff; font-family: sans-serif; letter-spacing: 10px;}" +
												".h1 {font-size: 33px; line-height: 38px; font-weight: bold;}" +
												".h1, .h2, .bodycopy {color: #153643; font-family: sans-serif;}" +
												".innerpadding {padding: 30px 30px 30px 30px; text-align: justify;}" +
												".borderbottom {border-bottom: 1px solid #f2eeed; text-align: justify;}" +
												".h2 {padding: 0 0 15px 0; font-size: 24px; line-height: 28px; font-weight: bold;}" +
												".bodycopy {font-size: 16px; line-height: 22px;  text-align: justify;}" +
												".button {text-align: center; font-size: 18px; font-family: sans-serif; font-weight: bold; padding: 0 30px 0 30px;}" +
												".button a {color: #ffffff; text-decoration: none;}" +
												".footer {padding: 20px 30px 15px 30px;}" +
												".footercopy {font-family: sans-serif; font-size: 14px; color: #ffffff;}" +
												".footercopy a {color: #ffffff; text-decoration: underline;}" +
											"</style>" +
										"</head>" +
										"<body yahoo bgcolor='#f6f8f1'>" +
											"<table width='100%' bgcolor='#f6f8f1' border='0' cellpadding='0' cellspacing='0'>" +
												"<tr>" +
													"<td>" +
														"<!--[if (gte mso 9)|(IE)]>" +
														"<table width='600' align='center' cellpadding='0' cellspacing='0' border='0'>" +
															"<tr>" +
																"<td>" +
																	"<![endif]-->" +
																	"<table class='content' align='center' cellpadding='0' cellspacing='0' border='0'>" +
																		"<!-- HEADER -->" +
																		"<tr>" +
																			"<td class='header' bgcolor='#c7d8a7'>" +
																				"<table width='70' align='left' border='0' cellpadding='0' cellspacing='0'>" +
																					"<tr>" +
																						"<td height='70' style='padding: 0 20px 20px 0;'>" +
																							"<img src='cid:unique@headerMail' width='70' height='70' border='0' alt='' / >" +
																						"</td>" +
																					"</tr>" +
																				"</table>" +
																				"<!--[if (gte mso 9)|(IE)]>" +
																				"<table width='425' align='left' cellpadding='0' cellspacing='0' border='0'>" +
																					"<tr>" +
																						"<td>" +
																						"<![endif]-->" +
																							"<table class='col425' align='left' border='0' cellpadding='0' cellspacing='0' style='width: 100%; max-width: 425px;'>" +
																								"<tr>" +
																									"<td height='70'>" +
																										"<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
																											"<tr>" +
																												"<td class='subhead' style='padding: 0 0 0 3px;'>" +
																												"	LLAOS 1.0" +
																												"</td>" +
																											"</tr>" +
																											"<tr>" +
																												"<td class='h1' style='padding: 5px 0 0 0;'>" +
																												"	Cotizaciones" +
																												"</td>" +
																											"</tr>" +
																										"</table>" +
																									"</td>" +
																								"</tr>" +
																							"</table>" + 
																						"<!--[if (gte mso 9)|(IE)]>" +
																						"</td>" +
																					"</tr>" +
																				"</table>" +
																				"<![endif]-->" +
																			"</td>" +
																		"</tr>" +
																		"<!-- CONTENIDO 1 -->" +
																		"<tr>" +
																			"<td class='innerpadding borderbottom'>" +
																				"<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
																					"<tr>" +
																						"<td class='h2'>" +
																						"	Estimado Deparamento de compras :" +
																						"</td>" +
																					"</tr>" +
																					"<tr>" +
																						"<td class='bodycopy'>" +
																						"	El proveedor de <strong> " + cotizacion.proveedor + " </strong> acaba de realizar" +
																						"	una cotizacion en el sistema con el código <strong> COT-" + cotizacion.codigo + "</strong> misma que esta adjunta a este" +
																						" 	correo, la cual ya ha sido revisada y cotizada por completo tal como fue solicitada, para que tome en cosideración"+
																						" 	todo lo que en ella se encuentre y se programe con tiempo para generar la orden de compra y programar envios.."+
																						"</td>" +
																					"</tr>" +
																				"</table>" +
																			"</td>" +
																		"</tr>" +
																		"<!-- CONTENIDO 3 -->" +
																		"<tr>" +
																			"<td class='innerpadding borderbottom'>" +
																			"	Este correo ha sido generado en automático por el sistema" +
																			"	llaos 1.0, no responda al mismo ya que no tendrá respuesta" +
																			"	alguna, si usted no es un usuario que autoriza Requisiciones" +
																			"	favor de reportar el insidente al departamento de sistemas." +
																			"<br>" +
																			"<br>" +
																			"	Cualquier problema para abrir la requisición o el sistema" +
																			"	favor de reportar al departamento de sistemas." +
																			"</td>" +
																		"</tr>" +
																		"<!-- FOOTER -->" +
																		"<tr>" +
																			"<td class='footer' bgcolor='#44525f'>" +
																				"<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
																					"<tr>" +
																						"<td align='center' class='footercopy'>" +
																						"	&reg; Llaos Acuacultura S.A. de C.V. " + new Date().getFullYear() + 
																						"</td>" +
																					"</tr>" +
																				"</table>" +
																			"</td>" +
																		"</tr>" +
																	"</table>" +
																	"<!--[if (gte mso 9)|(IE)]>" +
																"</td>" +
															"</tr>" +
														"</table>" +
														"<![endif]-->" +
													"</td>" +
												"</tr>" +
											"</table>" +
										"</body>" +
									"</html>",
						attachments:[
							{
								fileName: 'mail.png',
								path: './public/imgs/mail.png',
								cid: 'unique@headerMail'
							},
							{
								fileName: 'COT-' + cotizacion.codigo + '.pdf',
								path: './files/COT-' + cotizacion.codigo + '.pdf',
								cid: 'unique@pdf'
							},
						]
					}

					smtpTransport.sendMail(mailOptions, function(error,res){
						if(error){
							console.log(error);
						}else{
							console.log(res);

							var updCot = {
								estatus: "Enviada"
							}
				
							Cotizaciones.update({"_id": solicitud.params.id}, updCot, function(error){
								if(error){
									console.log(error);
								} else {
									if( solicitud.params.tipo == 1){
										Cotizaciones.findById({"_id": solicitud.body.codigo_id}, function(error, coti){
											if(error){
												console.log(error);
											} else {
												ArticulosCotizaciones.find({"cotizacion": coti.id}, function(error, articulos){
													if(error){
														console.log(error);
													} else {
														respuesta.render("Externos/Cotizaciones/cotizacion",
															{
																user: solicitud.session.user,
																articulos: articulos,
																cotizacion: coti.id,
																codigo_cot: coti.codigo,
																subtotal: parseFloat(coti.subtotal).toFixed(2),
																iva: parseFloat(coti.iva).toFixed(2) ,
																total:parseFloat(coti.total).toFixed(2),
																proveedor: solicitud.body.proveedor,
																vigencia: solicitud.body.vigencia,
																observaciones: solicitud.body.observaciones
															}
														);
													}
												});
											}
										});
									} else {
										
										Cotizaciones.find( function(error, cotizaciones){
											if(error){
												console.log(error);
											} else {
												respuesta.render("Externos/Cotizaciones/cotizaciones",
													{
														user: solicitud.session.user,
														cotizaciones: cotizaciones
													}
												);
											}
										});
									}
								}
							});

							console.log("Correo enviado!")
						}
						smtpTransport.close();
					});
				}
			})
		})

		// Generar pdf de cotización
		app.get("/cotizacion/generar/pdf/:id/:tipo", function(solicitud, respuesta){
			Cotizaciones.findById({"_id": solicitud.params.id}, function(error, cotizacion){
				if(error){
					//console.log(error);
				} else {
					//console.log(cotizacion);
					ArticulosCotizaciones.find({"cotizacion": cotizacion.id}, function(error, articulos){
						if(error){
							console.log(error);
						} else {
							// Crear el documento
							doc = new pdf({
								// Establecer tamaño de hoja
								size: 'letter'
							});
						
							// Logo empresa
							doc.image('./public/imgs/logo.png', 5, 40,{width: 200})
							
							// Nombre empresa y rfc
							doc.font('fonts/Roboto-Black.ttf')
							.fontSize(14)
							.text( cotizacion.proveedor, 310, 40, { align: 'right', width: 290 })
							
							// Nombre formato, fecha y hora de creación
							doc.font('fonts/Roboto-Regular.ttf')
							.fontSize(14)
							.text("Cotización",{ align: 'right' , width: 290})
							.text("Fecha: "+ obtenerfecha() + " - Hora: " + obtenerhora(),{ align: 'right' , width: 290})
							
							// Serie de la orden I = insumos M = mantenimientos
							doc.font('fonts/Roboto-Black.ttf')
							.text("Cot: " + cotizacion.codigo, {align: 'right', width: 290});

							// Cuadro orden de compra y orden número
							doc.font('fonts/Roboto-Regular.ttf')
							doc.lineWidth(25)
							doc.lineCap('butt')
							.fillColor("blue")
							.moveTo(400, 160)
							.lineTo(600, 160)
							.stroke()
						
							doc.fontSize(12)
							.fill('white')
							.text("No. Cotización", 460, 150)
						
							doc.polygon([401,170],[599,170],[599,195],[401,195])
							.lineWidth(2)
							.stroke()
							
							doc.fill('black')
							doc.text(cotizacion.id, 395, 175, { align: 'center' , width: 200})
						
							// Datos de la empresa
							doc.fillColor('black')
							doc.text("Flavio Borquez #1603 A", 15, 140, { align: 'left', width: 200})
							.text("Col. Prados del Tepeyac", { align: 'left', width: 200})
							.text("C.P. 85150, Cd. Obregón, Sonora.", { align: 'left', width: 200})
						
							// Datos de la cotización
							doc.font('fonts/Roboto-Black.ttf')
							.text("Vigencia", 15, 210, { align: 'left', width: 200})
							.text("Moneda", 95, 210, { align: 'left', width: 200})

							if (cotizacion.tipoCambio != ""){
								doc.text("Tipo de Cambio", 165, 210, { align: 'left', width: 200})
								.font('fonts/Roboto-Regular.ttf')
								.text( cotizacion.tipoCambio, 170, 225, { align: 'left'})
							}
							
							doc.font('fonts/Roboto-Regular.ttf')
							.text( cotizacion.vigencia, 20, 225,  { align: 'left'})
							.text( cotizacion.moneda, 100, 225, { align: 'left'})
							.text( cotizacion.tipoCambio, 170, 225, { align: 'left'})

							// Encabezados tabla
							doc.lineWidth(25)
							doc.lineCap('butt')
							.fillColor("blue")
							.moveTo(15, 280)
							.lineTo(600, 280)
							.stroke()
						
							doc.fontSize(12)
							.fill('white')
							.text("Cant", 17, 270, {align: 'center', width: 45})
							.text("Codigo", 59, 270,  {align: 'center', width: 70})
							.text("Descripción",109, 270, {align: 'center', width: 250})
							.text("Unidad",389, 270, {align: 'center', width: 45})
							.text("Tiemp. Ent",454, 270, {align: 'center', width: 80})
							.text("Importe",529, 270, {align: 'center', width: 80})
						
							// Llenado de tabla
							var y = 280,
								subtotal = 0.00,
								iva = 0.00,
								total = 0.00;

							articulos.forEach( function(art) {
								y += 15;
								doc.fillColor('black')
								.text(art.cantidad, 17, y, {align: 'center', width: 45})
								.text(art.codigo, 59, y,  {align: 'center', width: 70})
								.text(art.descripcion, 134, y, {align: 'left', width: 250})
								.text(art.unidad, 389, y, {align: 'center', width: 45})
								.text(art.tiempoEntrega, 454, y, {align: 'center', width: 80})
								.text(FormatMoney(true,parseFloat(art.precioNeto)), 529, y, {align: 'center', width: 80})

								subtotal += parseFloat(art.precioUnitario);
								iva += parseFloat(art.iva);
								total += parseFloat(art.precioNeto);
							});
											
							// División productos y totales
							doc.lineWidth(2)
							doc.lineCap('butt')
							.moveTo(15, 665)
							.lineTo(600, 665)
							.stroke()

							// Conciciones / Observaciones / Comentarios
							doc.font('fonts/Roboto-Black.ttf')
							.text("Conciciones / Observaciones / Comentarios", 15, 670, { align: 'left', width: 400 })
							doc.font('fonts/Roboto-Regular.ttf')
							.text(cotizacion.observaciones, 20, 685, { align: 'left', width: 480 })
							
							// Subtotal, IVA y total
							doc.font('fonts/Roboto-Black.ttf')
							.text("Subtotal", 440, 670, { align: 'right', width: 80 })
							.text("IVA", 440, 685, { align: 'right', width: 80 })
							.text("Total", 440, 700, { align: 'right', width: 80 })

							doc.font('fonts/Roboto-Regular.ttf')
							.text(FormatMoney(true,subtotal), 520, 670, { align: 'right', width: 80 })
							.text(FormatMoney(true,iva), 520, 685, { align: 'right', width: 80 })
							.text(FormatMoney(true,total), 520, 700, { align: 'right', width: 80 })
						
							// Creación del documento y guardado

							var nombre_archivo = './files/COT-' + cotizacion.codigo + '.pdf';
							
							//console.log(nombre_archivo);

							doc.pipe(fs.createWriteStream(nombre_archivo)).on('finish', function (){
								console.log('PDF closed');
							});
						
							// Finalize PDF file
							doc.end();

							var cotUpd = {
								estatus: "Generada"
							}

							Cotizaciones.update({"_id": solicitud.params.id}, cotUpd, function(error){
								if(error){
									console.log(error);
								} else {
									console.log("Update cotización correcta");
								}
							});

							if(solicitud.params.tipo == 1){
								Cotizaciones.find( function(error, cotizaciones){
									if(error){
										console.log(error);
									} else {
										respuesta.render("Externos/Cotizaciones/cotizaciones",
											{
												user: solicitud.session.user,
												cotizaciones: cotizaciones
											}
										);
									}
								});
							} else {
								Cotizaciones.findById({"_id": solicitud.body.codigo_id}, function(error, coti){
									if(error){
										console.log(error);
									} else {
										ArticulosCotizaciones.find({"cotizacion": coti.id}, function(error, articulos){
											if(error){
												console.log(error);
											} else {
												respuesta.render("Externos/Cotizaciones/cotizacion",
													{
														user: solicitud.session.user,
														articulos: articulos,
														cotizacion: coti.id,
														codigo_cot: coti.codigo,
														subtotal: parseFloat(coti.subtotal).toFixed(2),
														iva: parseFloat(coti.iva).toFixed(2) ,
														total:parseFloat(coti.total).toFixed(2),
														proveedor: solicitud.body.proveedor,
														vigencia: solicitud.body.vigencia,
														observaciones: solicitud.body.observaciones
													}
												);
											}
										});
									}
								});
							}

						}
					});
				}
			});
		})

		// Convertir cotización en orden de compra
		app.get("/cotizacion/orden/:id", function(solicitud, respuesta){
			Cotizaciones.findById({"_id": solicitud.params.id}, function(error, cotizacion){
				if(error){
					console.log(error);
				} else {
					Proveedores.find({"nombreEmpresa": cotizacion.empresa}, function(error, proveedor){
						if(error){
							console.log(error);
						} else {
							
							if(proveedor.length > 0){

								var cantOrd = 0;
								var serie = '';

								Cotizaciones.find( function(error, cotizaciones){
									if(error){
										console.log(error);
									} else {	
										cantOrd = cotizaciones.length;
									}
								});
																		
								// J. Parrilla
								if( solicitud.session.user.numero_nomina == 305 || solicitud.session.user.permisos == 'developer'){
									serie = 'M-' + zfill(cantOrd, 5);
								// J. Cuamea
								} else if (solicitud.session.user.numero_nomina == 306) {
									serie = 'I-' + zfill(cantOrd, 5);
								}

								var dataOrd = {
									proveedor: proveedor.id,
									fecha: obtenerfecha(),
									hora: obtenerhora,
									subtotal: cotizacion.subtotal,
									iva: cotizacion.iva,
									total: cotizacion.total,
									serie: serie,
									estatus: 'Nueva'
								}

								var ord = new Ordenes(dataOrd);

								ord.save( function(error, orden){
									if(error){
										console.log(error);
									} else {
										ArticulosCotizaciones.find({"cotizacion": cotizacion.id}, function(error, articulos){
											if(error){
												console.log(error);
											} else {
												articulos.forEach( function(art){

													var dataArt = {
														cantidad: art.cantidad,
														unidad: art.unidad,
														codigo: art.codigo,
														producto: art.descripcion,
														descripcion: art.descripcion,
														precio_unitario: art.precioUnitario,
														iva: art.iva,
														importe: art.precioNeto,
														orden: String
													}

													var arti = new ArticulosOrdenes(dataArt);

													arti.save( function(error){
														if(error){
															console.log(error);
														}
													});
												});
											}
										});
									}
								});

								var updCot = {
									estatus: "Orden"
								}
					
								Cotizaciones.update({"_id": solicitud.params.id}, updCot, function(error){
									if(error){
										console.log(error);
									} else {
										Cotizaciones.find( function(error, cotizaciones){
											if(error){
												console.log(error);
											} else {
												
												respuesta.render("Externos/Cotizaciones/cotizaciones",
													{
														user: solicitud.session.user,
														cotizaciones: cotizaciones
													}
												);
											}
										});
									}
								});										
							} else {
								respuesta.render("Externos/Cotizaciones/error_proveedor",
									{
										user: solicitud.session.user
									}
								);
							}
						}
					});
				}
			});
		})

		// Eliminar articulo de cotización
		app.get("/cotizacion/articulo/eliminar/:id/:id_cot", function(solicitud, respuesta){
			ArticulosCotizaciones.remove({"_id": solicitud.params.id}, function(error){
				if(error){
					console.log(error);
				} else {
					Cotizaciones.findById({"_id": solicitud.params.id_cot}, function(error, cotizacion){
						if(error){
							console.log(error);
						} else {
							ArticulosCotizaciones.find({"cotizacion": cotizacion.id}, function(error, articulos){
								if(error){
									console.log(error);
								} else {
									var subtotal = 0.00;
									var iva = 0.00;
									var total = 0.00;
									
									articulos.forEach( function(art) {
										subtotal = parseFloat(subtotal) + parseFloat(parseFloat(art.cantidad) * parseFloat(art.precioUnitario));
										iva = parseFloat(iva) + parseFloat(parseFloat(art.cantidad) * parseFloat(art.iva));
										total = parseFloat(total) + parseFloat(parseFloat(art.cantidad) * parseFloat(art.precioNeto));
									});

									var updTotales = {
										subtotal: parseFloat(subtotal).toFixed(2),
										iva: parseFloat(iva).toFixed(2),
										total: parseFloat(total).toFixed(2)
									}
							
									Cotizaciones.update({"_id": cotizacion.id}, updTotales, function(error, cot){
										if(error){
											console.log(error);
										} else {
											Cotizaciones.findById({"_id": cotizacion.id}, function(error, coti){
												if(error){
													console.log(error);
												} else {
													respuesta.render("Externos/Cotizaciones/cotizacion",
														{
															user: solicitud.session.user,
															articulos: articulos,
															cotizacion: coti.id,
															codigo_cot: coti.codigo,
															subtotal: parseFloat(coti.subtotal).toFixed(2),
															iva: parseFloat(coti.iva).toFixed(2) ,
															total:parseFloat(coti.total).toFixed(2),
															proveedor: solicitud.body.proveedor
														}
													);
												}
											});
											
										}
									});
								}
							});
						}
					});
				}
			})
		})

		// Eliminar cotización
		app.get("/cotizacion/eliminar/:id", function(solicitud, respuesta){
			Cotizaciones.remove({"_id": solicitud.params.id}, function(error){
				if(error){
					console.log(error);
				} else {
					Cotizaciones.find( function(error, cotizaciones){
						if(error){
							console.log(error);
						} else {
							respuesta.render("Externos/Cotizaciones/cotizaciones",
								{
									user: solicitud.session.user,
									cotizaciones: cotizaciones
								}
							);
						}
					});
				}
			});
		})

		// Cancelar cotización
		app.get("/cotizacion/cancelar/:id", function(solicitud, respuesta){
			var updCot = {
				estatus: "Cancelada"
			}

			Cotizaciones.update({"_id": solicitud.params.id}, updCot, function(error){
				if(error){
					console.log(error);
				} else {
					Cotizaciones.find( function(error, cotizaciones){
						if(error){
							console.log(error);
						} else {
							respuesta.render("Externos/Cotizaciones/cotizaciones",
								{
									user: solicitud.session.user,
									cotizaciones: cotizaciones
								}
							);
						}
					});
				}
			});

		});

		// Pagar cotización
		app.get("/cotizacion/pagar/:id", function(solicitud, respuesta){
			var updCot = {
				estatus: "Pagada"
			}

			Cotizaciones.update({"_id": solicitud.params.id}, updCot, function(error){
				if(error){
					console.log(error);
				} else {
					Cotizaciones.find( function(error, cotizaciones){
						if(error){
							console.log(error);
						} else {
							respuesta.render("Externos/Cotizaciones/cotizaciones",
								{
									user: solicitud.session.user,
									cotizaciones: cotizaciones
								}
							);
						}
					});
				}
			});
		});
		
		// Cotizaciones solo nuevas
		app.get("/externos/cotizaciones/nuevas", function(solicitud, respuesta){
			if(solicitud.session.user === 'undefined'){
				respuesta.redirect("/");
			}else{
				Cotizaciones.find({"estatus": "Nueva"}, function(error, cotizaciones){
					if(error){
						console.log(error);
					} else {
						respuesta.render("Externos/Cotizaciones/cotizaciones",
							{
								user: solicitud.session.user,
								cotizaciones: cotizaciones
							}
						);
					}
				});
			}
		})
		
	/************/

	/* INVENTARIOS */

		// Abrir inventario de granja
		app.get("/inventarios/granja", function(solicitud, respuesta){
			Inventarios.find( function(error, articulos){
				if(error){
					consolo.log(error);
				} else {
					Productos.find( function(error, productos){
						if(error){
							console.log(error);
						} else {
							Proveedores.find( function(error, proveedores){
								if(error){
									console.log(error);
								} else {
									respuesta.render("Inventarios/inventario",
										{
											user: solicitud.session.user,
											articulos: articulos,
											proveedores: proveedores,
											productos: productos
										}
									);
								}
							});
						}
					});
				}
			});
		})

		// Agregar nuevo artículo para almacen
		app.get("/invetarios/articulo/new", function(solicitud, respuesta){
			if(solicitud.session.user === 'undefined'){
				respuesta.redirect("/");
			} else {
				respuesta.render("Granja/Inventarios/articulo",
					{
						user: solicitud.session.user,
						products: {}
					}
				);
			}
		})

		// Buscar producto -- revisar si no se usará..
		app.post("/busqueda/producto", function(solicitud, respuesta){
			if(solicitud.body.criterio == "codigo"){
				Productos.find( { "codigo": solicitud.body.buscar}, function(error, productos){
					if(error){
						console.log(error);
					} else {
						Proveedores.find( function(error, proveedores){
							if(error){
								console.log(error);
							} else {
								respuesta.render("Granja/Inventarios/articulo", {
									user: solicitud.session.user,
									busca: solicitud.body.buscar,
									criterio: solicitud.body.criterio,
									products: productos,
									proveedores: proveedores,
								});
							}
						});
					}
				});
			} else if (solicitud.body.criterio == "nombre"){
				Productos.find( { "nombre": { '$regex': solicitud.body.buscar, $options: "i"}}, function(error, productos){
					if(error){
						console.log(erro0r);
					} else {
						Proveedores.find( function(error, proveedores){
							if(error){
								console.log(error);
							} else {
								respuesta.render("Granja/Inventarios/articulo", {
									user: solicitud.session.user,
									busca: solicitud.body.buscar,
									criterio: solicitud.body.criterio,
									products: productos,
									proveedores: proveedores
								});
							}
						});
					}
				});
			}
		})

		// Abrir entrada de artículo
		app.get("/inventario/entrada", function(solicitud, respuesta){
			if(solicitud.session.user === undefined){
				respuesta.redirect("/");
			}else{
				Proveedores.find( function(error, proveedores){
					if(error){
						console.log(error);
					} else {
						respuesta.render("Inventarios/entrada", 
							{
								codigo: '',
								user: solicitud.session.user,
								producto: {},
								productos: {},
								proveedores: proveedores
							}
						);
					}
				});
			}
		})

		// Abrir entrada de artículo
		app.get("/inventario/entrada/:id", function(solicitud, respuesta){
			if(solicitud.session.user === undefined){
				respuesta.redirect("/");
			}else{
				Productos.findById({"_id": solicitud.params.id}, function(error, producto){
					if(error){
						console.log(error);
					} else {
						Proveedores.find( function(error, proveedores){
							if(error){
								console.log(error);
							} else {
								respuesta.render("Inventarios/entrada", 
									{
										codigo: '',
										user: solicitud.session.user,
										producto: producto,
										productos: {},
										proveedores: proveedores
									}
								);
							}
						});
					}
				});
			}
		})

		// Abrir salida de artículo
		app.get("/inventario/salida", function(solicitud, respuesta){
			if(solicitud.session.user === undefined){
				respuesta.redirect("/");
			}else{
				Proveedores.find( function(error, proveedores){
					if(error){
						console.log(error);
					} else {
						respuesta.render("Inventarios/salida", 
							{
								codigo: '',
								user: solicitud.session.user,
								producto: {},
								productos: {},
								proveedores: proveedores
							}
						);
					}
				});
			}
		})

		// Abrir salida de artículo
		app.get("/inventario/salida/:id", function(solicitud, respuesta){
			if(solicitud.session.user === undefined){
				respuesta.redirect("/");
			}else{
				Productos.findById({"_id": solicitud.params.id}, function(error, producto){
					if(error){
						console.log(error);
					} else {
						Proveedores.find( function(error, proveedores){
							if(error){
								console.log(error);
							} else {
								respuesta.render("Inventarios/salida", 
									{
										codigo: '',
										user: solicitud.session.user,
										producto: producto,
										productos: {},
										proveedores: proveedores
									}
								);
							}
						});
					}
				});
			}
		})

		//Buscar artículo
		app.post("/buscar/articulo/:tipo", function(solicitud, respuesta){
			if(solicitud.body.criterio == "codigo"){
				Productos.findOne( { "codigo": solicitud.body.codigo }, function(error, producto){
					if(error){
						console.log(error);
					} else {
						Proveedores.find( function(error, proveedores){
							if(error){
								console.log(error);
							} else {
								if(solicitud.params.tipo == 1) {
									respuesta.render("Inventarios/entrada", 
									{
										codigo: solicitud.body.codigo,
										user: solicitud.session.user,
										producto: producto,
										productos: {},
										proveedores: proveedores	
									}
								);
								} else if(solicitud.params.tipo == 2) {
									respuesta.render("Inventarios/salida", 
									{
										codigo: solicitud.body.codigo,
										user: solicitud.session.user,
										producto: producto,
										productos: {},
										proveedores: proveedores	
									}
								);
								}	
								
							}
						});
					}
				});
			} else if(solicitud.body.criterio == "nombre"){
				Productos.find( { "nombre": { '$regex': solicitud.body.codigo, $options: "i"}}, function(error, productos){
					if(error){
						console.log(error);
					} else {
						Proveedores.find( function(error, proveedores){
							if(error){
								console.log(error);
							} else {
								respuesta.render("Inventarios/entrada", 
									{
										codigo: solicitud.body.codigo,
										user: solicitud.session.user,
										producto: {},
										productos: productos,
										proveedores: proveedores	
									}
								);
							}
						});
					}
				});
			}		
		});

		// Registrar entrada
		app.post("/registrar/entrada/:id_prod", function(solicitud, respuesta){
			Productos.findById({"_id": solicitud.params.id_prod}, function(error, producto){
				if(error){
					console.log(error);
				} else {

					var cant = parseFloat(solicitud.body.cantidad) + parseFloat(producto.cantidad);

					var updProd = {
						cantidad: cant,
						almacen: solicitud.body.almacen,
						orden: solicitud.body.orden,
						factura: solicitud.body.factura
					}

					console.log(updProd);

					Productos.update({"_id": producto.id}, updProd, function(error, prod){
						if(error){
							console.log(error);
						} else {
							var updOrd = {
								factura: solicitud.body.factura
							}

							Ordenes.findOne({"serie": solicitud.body.orden}, function(error, orden){
								if(error){
									console.log(error);
								} else {
									Ordenes.update({"_id": orden.id}, updOrd,function(error, ord){
										if(error){
											console.log(error);
										} else {

											var data = {
												producto: producto.id,
												cantidad: cant,
												orden: orden.serie,
												factura: solicitud.body.factura,
												fecha: obtenerfecha(),
												hora: obtenerhora(),
												usuario: solicitud.session.user.nombre
											}

											var entrada = new EntradaInventarios(data);
	
											entrada.save( function(error, entr){
												if(error){
													console.log(error);
												} else {
													respuesta.redirect("/inventarios/granja");
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		})

		// Registrar entrada
		app.post("/registrar/salida/:id_prod", function(solicitud, respuesta){
			Productos.findById({"_id": solicitud.params.id_prod}, function(error, producto){
				if(error){
					console.log(error);
				} else {

					var cant = parseFloat(producto.cantidad) - parseFloat(solicitud.body.cantidad);

					var updProd = {
						cantidad: cant
					}

					Productos.update({"_id": producto.id}, updProd, function(error, prod){
						if(error){
							console.log(error);
						} else {
							var data = {
								producto: producto.id,
								cantidad: solicitud.body.cantidad,
								solicitante: solicitud.body.solicitante,
								area: solicitud.body.area,
								modulo: solicitud.body.modulo,
								Estanque: solicitud.body.estanque,
								usuario: solicitud.session.user.nombre,
								fecha: obtenerfecha(),
								hora: obtenerhora()
							}

							var salida = new SalidaInventarios(data);
	
							salida.save( function(error, sali){
								if(error){
									console.log(error);
								} else {
									respuesta.redirect("/inventarios/granja");
								}
							});
						}
					});
				}
			});
		})

	/***************/


/***************/

/* Métodos Inicio y Cierre de sesión */

	// Revisar datos para inicio de sesión
	app.post("/inicio", function (solicitud, respuesta){
		Usuarios.findOne({"usuario": solicitud.body.user},function (error,usuario){
			if(error){
				console.log(error);
			} else {
				if(!usuario){
					respuesta.render("login",
						{	
							msg: "Error no existe le usuario: " + solicitud.body.user
						}
					);
					console.log("Usuario desconocido");
				}else{
					if(usuario.password == solicitud.body.pass){
						solicitud.session.user = usuario;
						Requisiciones.find( function(error, requisiciones){
							if(error){
								console.log(error);
							} else {
								Cotizaciones.find({"estatus": "Nueva"} , function(error, cotizaciones){
									if(error){
										console.log(error);
									} else {
										Requisiciones.find({"estatus": "Cancelada"}, function(error, canceladas){
											if(error){
												console.log(error);	
											} else {
												Ordenes.find({"estatus": "Nueva"}, function(error, ordenes){
													if(error){
														console.log(error);
													} else {
														Requisiciones.find({"estatus": "Cancelada"}, function(error, canceladas){
															if(error){
																console.log(error);
															} else {
																respuesta.render("index", 
																	{ 
																		user: solicitud.session.user,
																		requisiciones: requisiciones.length,
																		cotizaciones: cotizaciones.length,
																		ordenes: ordenes.length,
																		canceladas: canceladas.length
																	}
																);
															}
														});
													}
												})
											}
										})
									}
								});
							}
						});
						
					}else{
						respuesta.render("login",
							{msg: "Error contraseña incorrecta."}
						);
						console.log("contraseña incorrecta");
					}
				}
				
			}
		});
	});

	app.get("/home", function(solicitud, respuesta){
		if(solicitud.session.user === 'undefined'){
			respuesta.redirect("/");
		} else{
			Requisiciones.find( function(error, requisiciones){
				if(error){
					console.log(error);
				} else {
					Cotizaciones.find({"estatus": "Nueva"} , function(error, cotizaciones){
						if(error){
							console.log(error);
						} else {
							Ordenes.find({"estatus": "Nueva"}, function(error, ordenes){
								if(error){
									console.log(error);
								} else {
									Requisiciones.find({"estatus": "Cancelada"}, function(error, canceladas){
										if(error){
											console.log(error);
										} else {
											respuesta.render("index", 
												{ 
													user: solicitud.session.user,
													requisiciones: requisiciones.length,
													cotizaciones: cotizaciones.length,
													ordenes: ordenes.length,
													canceladas: canceladas.length
												}
											);
										}
									});
								}
							})
						}
					});
				}
			});
		}
	})

	app.get("/empresa/curriculum", function(solicitud, respuesta){
		respuesta.render("CV/index");
	})

	// Cerrar sesión
	app.get("/cerrar_sesion", function(solicitud, respuesta){
		//solicitud.session.user.
		respuesta.render("login",
			{ msg: "Por favor inicie sesión."}
		);
	})

/****************/

// Indicar a express en que puerto estará escuchando
app.listen(port);

function obtenerfecha(){
	var fecha = new Date()
	var dia = fecha.getDate();
	var mes = fecha.getMonth()+1;
	var anio = fecha.getFullYear();

	if(dia < 10){
		dia = "0"+dia;
	}

	if(mes < 10){
		mes = "0"+mes;
	}

	return dia+"/"+mes+"/"+anio;
}

function obtenerhora(){
	var tiempo = new Date();
	var horas = tiempo.getHours();
	var minutos = tiempo.getMinutes();
	var segundos = tiempo.getSeconds();
	var dn ="";

	if(horas < 12){
		dn = "a.m.";
	}else{
		dn = "p.m.";
	}

	if(horas < 10){
		horas = "0"+horas;
	}

	if(minutos < 10){
		minutos = "0"+minutos;
	}

	if(segundos < 10){
		segundos = "0"+segundos;
	}
		
	return horas+":"+minutos+":"+segundos+" "+dn;
}

function enviarCorreo(autoriza, usuario, requisicion){
	var mailOptions = {
		from: 'Llaos Sist 1.0 <sistema@llaos.com>',
		to: autoriza.correo,//'flopez@llaos.com',
		subject: 'Solicitud de requisición',
		html: "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>"+
					"<html xmlns='http://www.w3.org/1999/xhtml'>" +
						"<head>" +
							"<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />" +
							"<title>Requisiciones LLaos 1.0</title>" +
							"<style type='text/css'>" +
								"body {margin: 0; padding: 0; min-width: 100%!important;}" +
								".content {width: 100%; max-width: 600px;}" +
								"@media only screen and (min-device-width: 601px) {" +
								"	.content {width: 600px !important;}" +
								"	.header {padding: 40px 30px 20px 30px;}" +
								"}" +
								"@media only screen and (min-device-width: 601px) {" +
								"	.content {width: 600px !important;}" +
								"	.col425 {width: 425px!important;}" +
								"	.col380 {width: 380px!important;}" +
								"}" +
								"@media only screen and (max-width: 550px), screen and (max-device-width: 550px) {" +
								"	body[yahoo] .buttonwrapper {background-color: transparent!important;}" +
								"	body[yahoo] .button a {background-color: #e05443; padding: 15px 15px 13px!important; display: block!important;}" +
								"}" +
								".col425 {width: 425px!important;}" +
								".subhead {font-size: 15px; color: #ffffff; font-family: sans-serif; letter-spacing: 10px;}" +
								".h1 {font-size: 33px; line-height: 38px; font-weight: bold;}" +
								".h1, .h2, .bodycopy {color: #153643; font-family: sans-serif;}" +
								".innerpadding {padding: 30px 30px 30px 30px; text-align: justify;}" +
								".borderbottom {border-bottom: 1px solid #f2eeed; text-align: justify;}" +
								".h2 {padding: 0 0 15px 0; font-size: 24px; line-height: 28px; font-weight: bold;}" +
								".bodycopy {font-size: 16px; line-height: 22px;  text-align: justify;}" +
								".button {text-align: center; font-size: 18px; font-family: sans-serif; font-weight: bold; padding: 0 30px 0 30px;}" +
								".button a {color: #ffffff; text-decoration: none;}" +
								".footer {padding: 20px 30px 15px 30px;}" +
								".footercopy {font-family: sans-serif; font-size: 14px; color: #ffffff;}" +
								".footercopy a {color: #ffffff; text-decoration: underline;}" +
							"</style>" +
						"</head>" +
						"<body yahoo bgcolor='#f6f8f1'>" +
							"<table width='100%' bgcolor='#f6f8f1' border='0' cellpadding='0' cellspacing='0'>" +
								"<tr>" +
									"<td>" +
										"<!--[if (gte mso 9)|(IE)]>" +
										"<table width='600' align='center' cellpadding='0' cellspacing='0' border='0'>" +
											"<tr>" +
												"<td>" +
													"<![endif]-->" +
													"<table class='content' align='center' cellpadding='0' cellspacing='0' border='0'>" +
														"<!-- HEADER -->" +
														"<tr>" +
															"<td class='header' bgcolor='#c7d8a7'>" +
																"<table width='70' align='left' border='0' cellpadding='0' cellspacing='0'>" +
																	"<tr>" +
																		"<td height='70' style='padding: 0 20px 20px 0;'>" +
																			"<img src='cid:unique@headerMail' width='70' height='70' border='0' alt='' / >" +
																		"</td>" +
																	"</tr>" +
																"</table>" +
																"<!--[if (gte mso 9)|(IE)]>" +
																"<table width='425' align='left' cellpadding='0' cellspacing='0' border='0'>" +
																	"<tr>" +
																		"<td>" +
																		"<![endif]-->" +
																			"<table class='col425' align='left' border='0' cellpadding='0' cellspacing='0' style='width: 100%; max-width: 425px;'>" +
																				"<tr>" +
																					"<td height='70'>" +
																						"<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
																							"<tr>" +
																								"<td class='subhead' style='padding: 0 0 0 3px;'>" +
																								"	LLAOS 1.0" +
																								"</td>" +
																							"</tr>" +
																							"<tr>" +
																								"<td class='h1' style='padding: 5px 0 0 0;'>" +
																								"	Solicitud de Requisiciones" +
																								"</td>" +
																							"</tr>" +
																						"</table>" +
																					"</td>" +
																				"</tr>" +
																			"</table>" + 
																		"<!--[if (gte mso 9)|(IE)]>" +
																		"</td>" +
																	"</tr>" +
																"</table>" +
																"<![endif]-->" +
															"</td>" +
														"</tr>" +
														"<!-- CONTENIDO 1 -->" +
														"<tr>" +
															"<td class='innerpadding borderbottom'>" +
																"<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
																	"<tr>" +
																		"<td class='h2'>" +
																		"	Estimado "+ autoriza.nombre +" :" +
																		"</td>" +
																	"</tr>" +
																	"<tr>" +
																		"<td class='bodycopy'>" +
																		"	El usuario <strong> " + requisicion.solicita + " </strong> acaba de realizar" +
																		"	una solicitud de requisición con el código <strong>" + requisicion.id + "</strong> en el sistema, para el área de <strong>" + requisicion.area + "</strong> y lo " +  
																		" 	utilizara en <strong>" + requisicion.uso + "</strong>, si desea realizar acción alguna a la misma, haga clic en el botón ver requisición." +
																		"</td>" +
																	"</tr>" +
																	"<tr>" +
																		"<td style='padding: 20px 0 0 0;'>" +
																			"<table class='buttonwrapper' bgcolor='#e05443' border='0' cellspacing='0' cellpadding='0'>" +
																				"<tr>" +
																					"<td class='button' height='45'>" +
																					"<a href='192.168.1.65/requisicion/ver/"+ requisicion.id +"/" + autoriza.id + "'>Ver requisición</a>" +
																					"</td>" +
																				"</tr>" +
																			"</table>" +
																		"</td>" +
																	"</tr>" +
																"</table>" +
															"</td>" +
														"</tr>" +
														"<!-- CONTENIDO 3 -->" +
														"<tr>" +
															"<td class='innerpadding borderbottom'>" +
															"	Este correo ha sido generado en automático por el sistema" +
															"	llaos 1.0, no responda al mismo ya que no tendrá respuesta" +
															"	alguna, si usted no es un usuario que autoriza Requisiciones" +
															"	favor de reportar el insidente al departamento de sistemas." +
															"<br>" +
															"<br>" +
															"	Cualquier problema para abrir la requisición o el sistema" +
															"	favor de reportar al departamento de sistemas." +
															"</td>" +
														"</tr>" +
														"<!-- FOOTER -->" +
														"<tr>" +
															"<td class='footer' bgcolor='#44525f'>" +
																"<table width='100%' border='0' cellspacing='0' cellpadding='0'>" +
																	"<tr>" +
																		"<td align='center' class='footercopy'>" +
																		"	&reg; Llaos Acuacultura S.A. de C.V. 2018" +
																		"</td>" +
																	"</tr>" +
																"</table>" +
															"</td>" +
														"</tr>" +
													"</table>" +
													"<!--[if (gte mso 9)|(IE)]>" +
												"</td>" +
											"</tr>" +
										"</table>" +
										"<![endif]-->" +
									"</td>" +
								"</tr>" +
							"</table>" +
						"</body>" +
					"</html>",
		attachments:[
			{
				fileName: 'mail.png',
				path: './public/imgs/mail.png',
				cid: 'unique@headerMail'
			},
		]
	}

	smtpTransport.sendMail(mailOptions, function(error,res){
		if(error){
			console.log(error);
			return false;
		}else{
			console.log(res)
			/*Requisiciones.find( function(error, requisiciones){
				if(error){
					console.log(error);
				} else {
					Usuarios.find( function(error, usuarios){
						if(error){
							console.log(error);
						} else {
							respuesta.render("Requisiciones/requisiciones", {
								user: solicitud.session.user,
								requisiciones: requisiciones,
								usuarios: usuarios
							});
						}
					});
				}
			});*/
			console.log("Correo enviado!")
			return true;
		}
		smtpTransport.close();
	});

	
}

function generarPDF(){
	doc = new pdf({
		// Establecer tamaño de hoja
		size: 'letter'
	});

	// Logo empresa
	doc.image('./public/imgs/logo.png', 5, 40,{width: 200})
	
	// Nombre empresa y rfc
	doc.font('fonts/Roboto-Black.ttf')
	.fontSize(14)
	.text('LLAOS ACUACULTURA S.A. de C.V.', 310, 40, { align: 'right', width: 290 })
	.text('LAC040819TN1', { align: 'right', width: 290 })
	
	// Nombre formato, fecha y hora de creación
	doc.font('fonts/Roboto-Regular.ttf')
	.fontSize(14)
	.text("Orden de Compra",{ align: 'right' , width: 290})
	.text("Fecha: "+ obtenerfecha() + " - Hora: " + obtenerhora(),{ align: 'right' , width: 290})

	// Cuadro orden de compra y orden número
	doc.lineWidth(25)
	doc.lineCap('butt')
	.fillColor("blue")
	.moveTo(400, 160)
	.lineTo(600, 160)
	.stroke()

	doc.fontSize(12)
	.fill('white')
	.text("No. Orden", 470, 150)

	doc.polygon([401,170],[599,170],[599,195],[401,195])
	.lineWidth(2)
	.stroke()
	
	doc.fill('black')
	doc.text("#########################", 395, 175, { align: 'right' , width: 200})

	// Datos de la empresa
	doc.fillColor('black')
	doc.text("Flavio Borquez #1603 A", 15, 140, { align: 'left', width: 200})
	.text("Col. Prados del Tepeyac", { align: 'left', width: 200})
	.text("C.P. 85150, Cd. Obregón, Sonora.", { align: 'left', width: 200})

	// Datos del proveedor
	doc.font('fonts/Roboto-Black.ttf')
	.text("Proveedor", 15, 210, { align: 'left', width: 200})
	.font('fonts/Roboto-Regular.ttf')
	.text("H300 - OCTAVIO RODRIGUEZ GONZALEZ", { align: 'left', width: 800})

	// Encabezados tabla
	doc.lineWidth(25)
	doc.lineCap('butt')
	.fillColor("blue")
	.moveTo(15, 280)
	.lineTo(600, 280)
	.stroke()

	doc.fontSize(12)
	.fill('white')
	.text("Cant", 17, 270, {align: 'center', width: 45})
	.text("Codigo", 59, 270,  {align: 'center', width: 60})
	.text("Descripción",109, 270, {align: 'center', width: 250})
	.text("Unidad",389, 270, {align: 'center', width: 45})
	.text("P. Unitario",454, 270, {align: 'center', width: 60})
	.text("Importe",529, 270, {align: 'center', width: 60})

	// Llenado de tabla
	var x = 280,
		subtotal = 0.00,
		iva = 0.00,
		total = 0.00;


	for (var i = 0; i < 10; i++) {
		x += 15;
		doc.fillColor('black')
		.text("1.000", 17, x, {align: 'center', width: 45})
		.text("ASUS15", 59, x,  {align: 'center', width: 60})
		.text("LAPTOP ASUS XQ555 15.6 COLOR GRIS ",109, x, {align: 'center', width: 250})
		.text("PZA",389, x, {align: 'center', width: 45})
		.text("9855.53",454, x, {align: 'center', width: 60})
		.text("13589.56",529, x, {align: 'center', width: 60})
	}

	// División productos y totales
	doc.lineWidth(2)
	doc.lineCap('butt')
	.moveTo(15, 665)
	.lineTo(600, 665)
	.stroke()
	
	// Subtotal, IVA y total
	doc.text("Subtotal", 440, 670, { align: 'right', width: 80 })
	.text("9855.53", 520, 670, { align: 'right', width: 80 })
	.text("IVA", 440, 685, { align: 'right', width: 80 })
	.text("3734.03", 520, 685, { align: 'right', width: 80 })
	.text("Total", 440, 700, { align: 'right', width: 80 })
	.text("13589.56", 520, 700, { align: 'right', width: 80 })

	// Creación del documento y guardado
	doc.pipe(fs.createWriteStream('./files/prueba.pdf')).on('finish', function (){
		console.log('PDF closed');
	});

	// Finalize PDF file
	doc.end()
}

function zfill(number, width) {
	var numberOutput = Math.abs(number); /* Valor absoluto del número */
	var length = number.toString().length; /* Largo del número */ 
	var zero = "0"; /* String de cero */  
	
	if (width <= length) {
		if (number < 0) {
			return ("-" + numberOutput.toString()); 
		} else {
			return numberOutput.toString(); 
		}
	} else {
		if (number < 0) {
			return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
		} else {
			return ((zero.repeat(width - length)) + numberOutput.toString()); 
		}
	}
}

function FormatMoney(bol, valor){
	var total = 0;

	if (bol) {
		total += valor;
	} else {
		total-=valor;
	}
	
	var entero = '';
	
	Entero_Decimal = total.toString().split('.');
	
	cadena = Entero_Decimal[0].split('').reverse().join('');
	
	for (var z = cadena.length; z >=0; z--) {
		numero = cadena.charAt(z)
		
		if ((cadena.length >= 4 && z ==3 ) || (cadena.length >= 7 && z ==6 ) || (cadena.length >= 10 && z == 9 ) || (cadena.length >= 13 && z ==12 ) || (cadena.length >= 16 && z ==15 )) {
			numero +=  ",";
		}

		entero += numero;
	}
	
	if(Entero_Decimal[1]) {
		decimales = '.'+ Entero_Decimal[1];
	} else {
		decimales='.00';
	}
	
	return "$ " + entero + decimales;
}