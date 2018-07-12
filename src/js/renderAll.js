
function animate(time) {
	if (!params.pauseAnimation){
		requestAnimationFrame( animate );
		update(time);
		render();
	}

}

function update(time){
	params.keyboard.update();
	if (params.keyboard.down("H")){
		params.helpMessage=!params.helpMessage;
		if (params.helpMessage){
			showSplash();
		}
		else{
			hideSplash()
		}
	}
	if (params.keyboard.down("space")){
		params.useTrackball = !params.useTrackball;
		params.switchControls = true;
		params.controls.dispose();
		initControls();
	}
	
	params.controls.update();

	updateUICenterText();
	updateUICameraText();
	updateUIRotText();

	// camera's -z direction
	var cameraDir = params.camera.getWorldDirection();

	
	// find the camera's x and y axes 
	// quaternion is orientation of the camera WRT data space
	var cameraX =  new THREE.Vector3(1,0,0);
	var cameraY =  new THREE.Vector3(0,1,0);
	cameraX.applyQuaternion(params.camera.quaternion);
	cameraY.applyQuaternion(params.camera.quaternion);



	for (var i=0; i<params.partsKeys.length; i++){
		var p = params.partsKeys[i];
function animate(time) {
	if (!params.pauseAnimation){
		requestAnimationFrame( animate );
		update(time);
		render();
	}

}

function update(time){
	params.keyboard.update();
	if (params.keyboard.down("H")){
		params.helpMessage=!params.helpMessage;
		if (params.helpMessage){
			showSplash();
		}
		else{
			hideSplash()
		}
	}
	if (params.keyboard.down("space")){
		params.useTrackball = !params.useTrackball;
		params.switchControls = true;
		params.controls.dispose();
		initControls();
	}
	
	params.controls.update();

	updateUICenterText();
	updateUICameraText();
	updateUIRotText();

	// camera's -z direction
	var cameraDir = params.camera.getWorldDirection();

	
	// find the camera's x and y axes 
	// quaternion is orientation of the camera WRT data space
	var cameraX =  new THREE.Vector3(1,0,0);
	var cameraY =  new THREE.Vector3(0,1,0);
	cameraX.applyQuaternion(params.camera.quaternion);
	cameraY.applyQuaternion(params.camera.quaternion);



	for (var i=0; i<params.partsKeys.length; i++){
		var p = params.partsKeys[i];
		params.partsMesh[p].forEach( function( m, j ) {
			// toggle colormap
			if (params.keyboard.down("V") & m.material.uniforms.useColorBar.value == 0){
				m.material.uniforms.useColorBar.value = 1;
				console.log(p, "toggled", m.material.uniforms.useColorBar.value)
			}
			else if (params.keyboard.down("T") & m.material.uniforms.useColorBar.value == 0 & params.parts[p].log10Temperature != null){
				m.material.uniforms.useColorBar.value = 2;
				console.log(p, "toggled", m.material.uniforms.useColorBar.value)
			}
			else if (params.keyboard.down("V") & m.material.uniforms.useColorBar.value == 1 
				|| params.keyboard.down("T") & m.material.uniforms.useColorBar.value == 2 & params.parts[p].log10Temperature != null){
				m.material.uniforms.useColorBar.value = 0;
				console.log(p, "toggled", m.material.uniforms.useColorBar.value)
			}

			// if (params.keyboard.down("V")){
			// 	if (m.material.uniforms.useColorBar.value == 0){
			// 		m.material.uniforms.useColorBar.value = 1;
			// 	}
			// 	else if (m.material.uniforms.useColorBar.value == 1){
			// 		m.material.uniforms.useColorBar.value = 0;
			// 	}
			// console.log(p, "toggled", m.material.uniforms.useColorBar.value)
			// }
			// else if (params.keyboard.down("T") & params.parts[p].log10Temperature != null){
			// 	if (m.material.uniforms.useColorBar.value == 0){
			// 		m.material.uniforms.useColorBar.value = 2;
			// 	}
			// 	else if (m.material.uniforms.useColorBar.value == 2){
			// 		m.material.uniforms.useColorBar.value = 0;
			// 	}
			// console.log(p, "toggled", m.material.uniforms.useColorBar.value)
			// }
			
			m.material.uniforms.velType.value = params.velopts[params.velType[p]];
			if (params.showParts[p]) {

				m.geometry.setDrawRange( 0, params.plotNmax[p]*(1./params.decimate) )
				m.material.uniforms.uVertexScale.value = params.PsizeMult[p];

				m.material.uniforms.color.value = new THREE.Vector4( params.Pcolors[p][0], params.Pcolors[p][1], params.Pcolors[p][2], params.Pcolors[p][3]);
				if (params.showVel[p]){
					// pass camera orientation to the shader
					m.material.uniforms.cameraX.value = [cameraX.x,cameraX.y,cameraX.z];
					m.material.uniforms.cameraY.value = [cameraY.x,cameraY.y,cameraY.z];
					m.material.uniforms.oID.value = 1.;
					m.material.uniforms.uVertexScale.value *= params.vSizeMult;

				} else {
					m.material.uniforms.oID.value = 0.;
				}
				//this should not be needed because we now redraw every time we filter
				// but I will leave it here, in case we want to revert back to this method
				// if (params.updateFilter[p]){
				// 	var alphas = m.geometry.attributes.alpha.array;
				// 	for( var ii = 0; ii < alphas.length; ii ++ ) {
				// 		alphas[ii] = 1.;
				// 		for (k=0; k<params.fkeys[p].length; k++){
				// 			if (params.parts[p][params.fkeys[p][k]] != null) {
				// 				val = params.parts[p][params.fkeys[p][k]][ii]; 
				// 				if ( val < params.filterVals[p][params.fkeys[p][k]][0] || val > params.filterVals[p][params.fkeys[p][k]][1] ){
				// 					alphas[ii] = 0.;
				// 				} 
				// 			}
				// 		}
				// 	}
				// 	m.geometry.attributes.alpha.needsUpdate = true;
				// 	params.updateFilter[p] = false;
				// }
			} else { 
				m.material.uniforms.color.value = new THREE.Vector4(0);
				m.material.uniforms.oID.value = -1;
			}

		});
	}

}


function render() {

	params.renderer.render( params.scene, params.camera );

}

function animate(time) {
	if (!params.pauseAnimation){
		requestAnimationFrame( animate );
		update(time);
		render();
	}

}

function update(time){
	params.keyboard.update();
	if (params.keyboard.down("H")){
		params.helpMessage=!params.helpMessage;
		if (params.helpMessage){
			showSplash();
		}
		else{
			hideSplash()
		}
	}
	if (params.keyboard.down("space")){
		params.useTrackball = !params.useTrackball;
		params.switchControls = true;
		params.controls.dispose();
		initControls();
	}
	
	// toggle colormap
	if (params.keyboard.down("C")){
		if (params.toggle){
			params.toggle = false;
		}
		else{
			params.toggle = true;
		}
		console.log("toggled", params.toggle)
	}
	params.controls.update();

	updateUICenterText();
	updateUICameraText();
	updateUIRotText();

	// camera's -z direction
	var cameraDir = params.camera.getWorldDirection();

	
	// find the camera's x and y axes 
	// quaternion is orientation of the camera WRT data space
	var cameraX =  new THREE.Vector3(1,0,0);
	var cameraY =  new THREE.Vector3(0,1,0);
	cameraX.applyQuaternion(params.camera.quaternion);
	cameraY.applyQuaternion(params.camera.quaternion);



	for (var i=0; i<params.partsKeys.length; i++){
		var p = params.partsKeys[i];
		params.partsMesh[p].forEach( function( m, j ) {
			m.material.uniforms.velType.value = params.velopts[params.velType[p]];
			if (params.showParts[p]) {

				m.geometry.setDrawRange( 0, params.plotNmax[p]*(1./params.decimate) )
				m.material.uniforms.uVertexScale.value = params.PsizeMult[p];

				m.material.uniforms.color.value = new THREE.Vector4( params.Pcolors[p][0], params.Pcolors[p][1], params.Pcolors[p][2], params.Pcolors[p][3]);
				if (params.showVel[p]){
					// pass camera orientation to the shader
					m.material.uniforms.cameraX.value = [cameraX.x,cameraX.y,cameraX.z];
					m.material.uniforms.cameraY.value = [cameraY.x,cameraY.y,cameraY.z];
					m.material.uniforms.oID.value = 1.;
					m.material.uniforms.uVertexScale.value *= params.vSizeMult;

				} else {
					m.material.uniforms.oID.value = 0.;
				}
				//this should not be needed because we now redraw every time we filter
				// but I will leave it here, in case we want to revert back to this method
				// if (params.updateFilter[p]){
				// 	var alphas = m.geometry.attributes.alpha.array;
				// 	for( var ii = 0; ii < alphas.length; ii ++ ) {
				// 		alphas[ii] = 1.;
				// 		for (k=0; k<params.fkeys[p].length; k++){
				// 			if (params.parts[p][params.fkeys[p][k]] != null) {
				// 				val = params.parts[p][params.fkeys[p][k]][ii]; 
				// 				if ( val < params.filterVals[p][params.fkeys[p][k]][0] || val > params.filterVals[p][params.fkeys[p][k]][1] ){
				// 					alphas[ii] = 0.;
				// 				} 
				// 			}
				// 		}
				// 	}
				// 	m.geometry.attributes.alpha.needsUpdate = true;
				// 	params.updateFilter[p] = false;
				// }
			} else { 
				m.material.uniforms.color.value = new THREE.Vector4(0);
				m.material.uniforms.oID.value = -1;
			}

		});
	}

}


function render() {

	params.renderer.render( params.scene, params.camera );

}

		params.partsMesh[p].forEach( function( m, j ) {
			m.material.uniforms.velType.value = params.velopts[params.velType[p]];
			if (params.showParts[p]) {

				m.geometry.setDrawRange( 0, params.plotNmax[p]*(1./params.decimate) )
				m.material.uniforms.uVertexScale.value = params.PsizeMult[p];

				m.material.uniforms.color.value = new THREE.Vector4( params.Pcolors[p][0], params.Pcolors[p][1], params.Pcolors[p][2], params.Pcolors[p][3]);
				if (params.showVel[p]){
					// pass camera orientation to the shader
					m.material.uniforms.cameraX.value = [cameraX.x,cameraX.y,cameraX.z];
					m.material.uniforms.cameraY.value = [cameraY.x,cameraY.y,cameraY.z];
					m.material.uniforms.oID.value = 1.;
					m.material.uniforms.uVertexScale.value *= params.vSizeMult;

				} else {
					m.material.uniforms.oID.value = 0.;
				}
				//this should not be needed because we now redraw every time we filter
				// but I will leave it here, in case we want to revert back to this method
				// if (params.updateFilter[p]){
				// 	var alphas = m.geometry.attributes.alpha.array;
				// 	for( var ii = 0; ii < alphas.length; ii ++ ) {
				// 		alphas[ii] = 1.;
				// 		for (k=0; k<params.fkeys[p].length; k++){
				// 			if (params.parts[p][params.fkeys[p][k]] != null) {
				// 				val = params.parts[p][params.fkeys[p][k]][ii]; 
				// 				if ( val < params.filterVals[p][params.fkeys[p][k]][0] || val > params.filterVals[p][params.fkeys[p][k]][1] ){
				// 					alphas[ii] = 0.;
				// 				} 
				// 			}
				// 		}
				// 	}
				// 	m.geometry.attributes.alpha.needsUpdate = true;
				// 	params.updateFilter[p] = false;
				// }
			} else { 
				m.material.uniforms.color.value = new THREE.Vector4(0);
				m.material.uniforms.oID.value = -1;
			}

		});
	}

}


function render() {

	params.renderer.render( params.scene, params.camera );

}
