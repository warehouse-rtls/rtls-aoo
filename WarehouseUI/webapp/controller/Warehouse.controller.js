sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/threejs/thirdparty/three",
	"sap/ui/core/routing/History"
], function (Controller, ContentResource, ContentConnector, threejs, History) {
	"use strict";

	return Controller.extend("com.sap.WarehouseUI.controller.Warehouse", {

		onInit: function () {

			function threejsObjectLoader(parentNode, contentResource) {
				parentNode.add(contentResource.getSource());
				return Promise.resolve({
					node: parentNode,
					contentResource: contentResource
				});
			}

			function threejsContentManagerResolver(contentResource) {
				if (contentResource.getSource() instanceof THREE.Object3D) {
					return Promise.resolve({
						dimension: 3,
						contentManagerClassName: "sap.ui.vk.threejs.ContentManager",
						settings: {
							loader: threejsObjectLoader
						}
					});
				} else {
					return Promise.reject();
				}
			}

			ContentConnector.addContentManagerResolver(threejsContentManagerResolver);

			function initObject(obj, name, posX, posY, posZ, id) {
				obj.name = name;
				obj.position.set(posX, posY, posZ);
				obj.userData.treeNode = {
					sid: id
				};
			}

			$.ajax({
				url: "/Location/",
				//url: "/destinations/mro-test/StockerCompany/" + StockerData.id,
				success: function (data) {
					var oModel = new JSONModel(data[0]);
					that.getView().setModel(oModel, "Location");
				},
				error: function (error) {
					MessageToast.show(that.getView().getModel("i18n").getResourceBundle().getText("accessErrorHANA"));
				}
			});

			// ウィンドウサイズ
			var wi = window.innerWidth;
			var he = window.innerHeight;

			//レンダラーを作成
			var renderer = new THREE.WebGLRenderer();
			renderer.setSize(wi, he); // 描画サイズ
			renderer.setPixelRatio(window.devicePixelRatio); // ピクセル比

			// #canvas-containerにレンダラーのcanvasを追加
			var container = document.getElementById("container");
			container.appendChild(renderer.domElement);
			// カメラを作成 (視野角, 画面のアスペクト比, カメラに映る最短距離, カメラに映る最遠距離)
			var camera = new THREE.PerspectiveCamera(60, wi / he, 1, 10);
			camera.position.x = 6; // カメラを遠ざける

			// シーンを作成
			var scene = new THREE.Scene();

			var root = new THREE.Group();
			initObject(root, "Atsugi Warehouse", 0, 0, 0, "0");

			root.add(new THREE.GridHelper(200));
			root.add(new THREE.AxesHelper(50));

			var obj = new THREE.Mesh(
				new THREE.BoxGeometry(10, 10, 10),
				new THREE.MeshPhongMaterial({
					color: 0x0000C0,
					shading: THREE.FlatShading
				})
			);
			initObject(obj, "Bin1", 40, 5, 40, "1");
			root.add(obj);

			obj = new THREE.Mesh(
				new THREE.BoxGeometry(10, 10, 10),
				new THREE.MeshPhongMaterial({
					color: 0x0000C0,
					shading: THREE.FlatShading
				})
			);
			initObject(obj, "Bin2", -40, 5, 40, "2");
			root.add(obj);

			obj = new THREE.Mesh(
				new THREE.BoxGeometry(10, 10, 10),
				new THREE.MeshPhongMaterial({
					color: 0x0000C0,
					shading: THREE.FlatShading
				})
			);
			initObject(obj, "Bin3", 40, 5, -40, "3");
			root.add(obj);

			obj = new THREE.Mesh(
				new THREE.BoxGeometry(10, 10, 10),
				new THREE.MeshPhongMaterial({
					color: 0x0000C0,
					shading: THREE.FlatShading
				})
			);
			initObject(obj, "Bin4", -40, 5, -40, "4");
			root.add(obj);

			obj = new THREE.Mesh(
				new THREE.CylinderBufferGeometry(1, 1, 10, 48),
				new THREE.MeshPhongMaterial({
					color: 0xC00000
				})
			);
			initObject(obj, "Worker", 0, 5, 0, "5");
			root.add(obj);

			this.getView().byId("viewer").addContentResource(
				new ContentResource({
					source: root,
					sourceType: "THREE.Object3D",
					name: "Nissan 3D Warehouse"
				})
			);

			function render() {
				// 次のフレームを要求
				requestAnimationFrame(() => {
					render();
				});

				// ミリ秒から秒に変換
				//var sec = performance.now() / 1000;

				//歩く
				//obj.position.z = sec * (Math.PI / 3);
				//obj.position.x = sec * (Math.PI / 3);
				obj.position.z += 0.01;
				obj.position.x += 0.01;

				// 画面に表示
				renderer.render(scene, camera);
			};
			render();

		},

		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("home", true);
			}
		}
	});
});