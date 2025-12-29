
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ModelViewerProps {
  results: any;
  pallet: { length: number; width: number; height: number; };
  box: { length: number; width: number; height: number; quantity: number };
  onClose: () => void;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ results, pallet, box, onClose }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1C2B3A);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 1, 5000);
    camera.position.set(300, 250, 400);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 100;
    controls.maxDistance = 2500;
    controls.target.set(0, 50, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(200, 400, 300);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -500;
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.bottom = -500;
    scene.add(directionalLight);

    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(5000, 5000);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x2A3B4A, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Materials
    const woodMaterial = new THREE.MeshStandardMaterial({ color: 0xD2B48C, roughness: 0.8, metalness: 0.1 });
    const cardboardMaterial = new THREE.MeshStandardMaterial({ color: 0xBF9B7A, roughness: 0.9, metalness: 0.0 });
    
    // --- Create a single, detailed pallet mesh ---
    const createPalletMesh = () => {
      const palletGroup = new THREE.Group();
      const pL = pallet.length, pW = pallet.width, pH = pallet.height;
      const plankH = 2; // Height of planks
      
      const bottomPlankGeo = new THREE.BoxGeometry(pL, plankH, 10);
      [-pW/2 + 5, 0, pW/2 - 5].forEach(pos => {
          const plank = new THREE.Mesh(bottomPlankGeo, woodMaterial);
          plank.position.set(0, plankH/2, pos);
          palletGroup.add(plank);
      });

      const blockGeo = new THREE.BoxGeometry(10, pH - (2*plankH) , 10);
      [-pL/2 + 5, 0, pL/2 - 5].forEach(xPos => {
          [-pW/2 + 5, 0, pW/2 - 5].forEach(zPos => {
              const block = new THREE.Mesh(blockGeo, woodMaterial);
              block.position.set(xPos, plankH + (pH - 2*plankH)/2, zPos);
              palletGroup.add(block);
          });
      });

      const topPlankGeo = new THREE.BoxGeometry(10, plankH, pW);
      [-pL/2+5, -pL/4, 0, pL/4, pL/2-5].forEach(pos => {
          const plank = new THREE.Mesh(topPlankGeo, woodMaterial);
          plank.position.set(pos, pH - plankH/2, 0);
          palletGroup.add(plank);
      });

      palletGroup.traverse(node => {
          if (node instanceof THREE.Mesh) {
              node.castShadow = true;
              node.receiveShadow = true;
          }
      });
      return palletGroup;
    }
    
    const palletMesh = createPalletMesh();

    // --- Arrange all pallets in a grid ---
    const { totalPalletsNeeded, layersPerPallet, bestBoxOrientation, actualBoxesPerPallet } = results;
    const gridDim = Math.ceil(Math.sqrt(totalPalletsNeeded));
    const spacing = 50;
    
    for (let i = 0; i < totalPalletsNeeded; i++) {
        const palletClone = palletMesh.clone();
        const row = Math.floor(i / gridDim);
        const col = i % gridDim;
        
        const x = col * (pallet.length + spacing) - (gridDim - 1) * (pallet.length + spacing) / 2;
        const z = row * (pallet.width + spacing) - (gridDim - 1) * (pallet.width + spacing) / 2;
        
        palletClone.position.set(x, 0, z);
        scene.add(palletClone);
    }
    
    // --- OPTIMIZATION: Use InstancedMesh for all boxes ---
    const boxGeo = new THREE.BoxGeometry(box.length, box.height, box.width);
    const boxInstancedMesh = new THREE.InstancedMesh(boxGeo, cardboardMaterial, box.quantity);
    boxInstancedMesh.castShadow = true;
    boxInstancedMesh.receiveShadow = true;
    scene.add(boxInstancedMesh);
    
    const dummy = new THREE.Object3D(); // Dummy object to get matrix
    let instanceIdx = 0;

    const boxL = bestBoxOrientation === 'lw' ? box.length : box.width;
    const boxW = bestBoxOrientation === 'lw' ? box.width : box.length;
    
    const cols = Math.floor(pallet.length / boxL);
    const rows = Math.floor(pallet.width / boxW);

    // Loop through each pallet position
    for (let p_idx = 0; p_idx < totalPalletsNeeded; p_idx++) {
        if (instanceIdx >= box.quantity) break;
        
        const palletGridRow = Math.floor(p_idx / gridDim);
        const palletGridCol = p_idx % gridDim;
        const palletX = palletGridCol * (pallet.length + spacing) - (gridDim - 1) * (pallet.length + spacing) / 2;
        const palletZ = palletGridRow * (pallet.width + spacing) - (gridDim - 1) * (pallet.width + spacing) / 2;
        
        // Loop to place boxes on the current pallet
        let boxesOnThisPallet = 0;
        for (let l = 0; l < layersPerPallet; l++) {
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (instanceIdx >= box.quantity || boxesOnThisPallet >= actualBoxesPerPallet) break;

                    const x = -pallet.length/2 + c * boxL + boxL/2;
                    const y = pallet.height + l * box.height + box.height/2;
                    const z = -pallet.width/2 + r * boxW + boxW/2;
                    
                    dummy.position.set(palletX + x, y, palletZ + z);
                    if (bestBoxOrientation === 'wl') {
                        dummy.rotation.y = Math.PI / 2;
                    } else {
                        dummy.rotation.y = 0;
                    }
                    dummy.updateMatrix();
                    boxInstancedMesh.setMatrixAt(instanceIdx, dummy.matrix);

                    instanceIdx++;
                    boxesOnThisPallet++;
                }
                if (instanceIdx >= box.quantity || boxesOnThisPallet >= actualBoxesPerPallet) break;
            }
            if (instanceIdx >= box.quantity || boxesOnThisPallet >= actualBoxesPerPallet) break;
        }
    }
    boxInstancedMesh.instanceMatrix.needsUpdate = true;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Responsive handling
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if(mount && renderer.domElement){
         mount.removeChild(renderer.domElement);
      }
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
             object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [results, pallet, box]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]">
      <div className="bg-dark bg-opacity-80 backdrop-blur-sm p-4 rounded-lg shadow-2xl relative w-11/12 h-5/6 max-w-6xl">
        <button onClick={onClose} className="absolute top-3 right-4 z-10 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg hover:bg-red-700 transition-colors">&times;</button>
        <div className="absolute top-3 left-4 text-white text-center">
            <h3 className="text-xl font-bold">Visualización 3D de la Carga</h3>
            <p className="text-sm opacity-80">Arrastra para orbitar, rueda para zoom, clic derecho para mover.</p>
        </div>
        <div ref={mountRef} className="w-full h-full rounded-md overflow-hidden" />
      </div>
    </div>
  );
};

export default ModelViewer;
