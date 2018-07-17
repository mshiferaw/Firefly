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
		var p = params.partsKeys[i];var myFragmentShader = `

precision mediump float;

varying float vID;
varying float vAlpha;
varying float vTheta;
varying float vMag;
varying float tMag;
//varying float vVertexScale;
//varying float glPointSize;

uniform float useColorBar;
uniform vec4 color;
uniform int SPHrad;
uniform float velType; //0 = line, 1 = arrow, 2 = triangle
uniform sampler2D tex;

//http://www.neilmendoza.com/glsl-rotation-about-an-arbitrary-axis/
mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}
void main(void) {
    gl_FragColor = color;

    if (useColorBar > 0.){
        if (vID > -1.){
            vec2 pos = vec2(vMag, useColorBar);
            vec3 c = texture2D(tex, pos).rgb;
            gl_FragColor.rgb = c;
        }
    }

    float dist = 0.;
    if (vID < 0.5){ //normal mode, plotting points (should be vID == 0, but this may be safer)
        // Get the distance vector from the center
        vec2 fromCenter = abs(gl_PointCoord - vec2(0.5));
        dist = 2.*length(fromCenter) ;
        float dist2 = dist*dist;
        // best fit quartic to SPH kernel (unormalized)
        if (SPHrad == 1){
            float alpha_SPH =  -4.87537494*dist2*dist2 + 11.75074987*dist2*dist - 8.14117164*dist2 + 0.2657967*dist + 0.99328463;
            gl_FragColor.a *= alpha_SPH;
        } 
        else {
            gl_FragColor.a *= 1. - dist;
        }
    } else { //velocities, lines (Note: requiring vID == 1. breaks in windows for some reason)

        
        mat4 rot1 = rotationMatrix(vec3(0,0,1), vTheta);
        vec2 posRot = (rot1 * vec4(gl_PointCoord.x-0.5, gl_PointCoord.y-0.5,0., 1.)).xy;
        
        float lW = 0.02;

        // puts tail of vector at -1*lW (half-width offset helps with head-on view)
        if (posRot.x < -1.*lW){
            discard;
        }

        //impose minimum size, it will never be shorter than it is thick
        float vSize = max(0.5,lW);

        //line
        if (velType == 0.){ 
            if (posRot.x > vSize || abs(posRot.y) > lW ){
                discard;
            } 
        }

        //arrow
        float aH = 0.2;
        float aL = 0.75;
        if (velType == 1.){ //arrow
            if (posRot.x > vSize || (posRot.x < vSize*aL && abs(posRot.y) > lW) || (posRot.x > vSize*aL && abs(posRot.y) > (-1.*aH/vSize * posRot.x + aH) )   ){
                discard;
            } 
        }

        //triangle
        float tH = 0.1; 
        if (velType == 2.){ 
            if (posRot.x > vSize || abs(posRot.y) > (-1.*tH/(vSize) * posRot.x + tH)    ){
                discard;
            } 
        } 
        //gl_FragColor.rgb +=  (1. - posRot.x/vSize); //white at tail
        gl_FragColor.rgb +=  0.6*posRot.x/vSize; //whiter at head
        gl_FragColor.a = posRot.x/vSize;
}
    gl_FragColor.a *= vAlpha;
}
`;
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

			// loop through colormaps using arrow keys
			if (params.keyboard.down("up")){
				if (m.material.uniforms.useColorBar.value == 0.){
					m.material.uniforms.useColorBar.value = 0.015625;
				}
				else if (m.material.uniforms.useColorBar.value == 0.984375){
					m.material.uniforms.useColorBar.value = 0.;
				}
				else{
					m.material.uniforms.useColorBar.value += 0.03125;
				}
			console.log(p, "toggled", m.material.uniforms.useColorBar.value)
			}
			else if (params.keyboard.down("down")){
				if (m.material.uniforms.useColorBar.value == 0.){
					m.material.uniforms.useColorBar.value = 0.984375;
				}
				else if (m.material.uniforms.useColorBar.value == 0.015625){
					m.material.uniforms.useColorBar.value = 0.;
				}
				else{
					m.material.uniforms.useColorBar.value -= 0.03125;
				}
			console.log(p, "toggled", m.material.uniforms.useColorBar.value)
			}
			
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


	for (var i=0; i<params.partsKeys.length; i++){
		var p = params.partsKeys[i];
		params.partsMesh[p].forEach( function( m, j ) {
<<<<<<< HEAD

			// loop through possible colormap variables using left/right arrow keys
			if (params.keyboard.down("right")){
				if (params.colormapVariable[p] == params.ckeys[p].length - 1){
					params.colormapVariable[p] = 0;
				}
				else{
					params.colormapVariable[p] += 1;
				}
			}
			if (params.keyboard.down("left")){
				if (params.colormapVariable[p] == 0){
					params.colormapVariable[p] = params.ckeys[p].length - 1;
				}
				else{
					params.colormapVariable[p] -= 1;
				}
			}

			// loop through all 32 possible colormaps using up/down arrow keys
			// negative colormap value means no colormap will be applied
			if (params.keyboard.down("up")){
				if (params.colormap[p] == 252/256){
					params.colormap[p] = -4/256;
				}
				else{
					params.colormap[p] += 8/256;
				}
			}
			else if (params.keyboard.down("down")){
				if (params.colormap[p] == -4/256){
					params.colormap[p] = 252/256;
				}
				else{
					params.colormap[p] -= 8/256;
				}
			}
			
=======
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
>>>>>>> bae43f4f212b04d6306bfaee39ea1d6499004f1c
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
				
			} else { 
				m.material.uniforms.color.value = new THREE.Vector4(0);
				m.material.uniforms.oID.value = -1;
			}

		});
	}

	// redraw scene whenever colormap variables are changed
	if (params.keyboard.down("right") || params.keyboard.down("left") || 
	    params.keyboard.down("up") || params.keyboard.down("down")){
		console.log("current variable:", params.colormapVariable[p])
		console.log("current colormap:", params.colormap[p] * (256/8) + 0.5)
		drawScene();
	}

}


function render() {

	params.renderer.render( params.scene, params.camera );

}
