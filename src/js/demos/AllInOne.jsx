import React, { useEffect, useRef, useState, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

// import GLTF loader - originally in examples/jsm/loaders/
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// import components:
import BackButton from '../components/BackButton'
import VTOButton from '../components/VTOButton'

// import neural network models:
import NN_GLASSES from '../contrib/WebARRocksFace/neuralNets/NN_GLASSES_9.json'
import NN_HAT from '../contrib/WebARRocksFace/neuralNets/NN_HEADPHONES_4.json'

// import WebARRocksMirror, a helper
import mirrorHelper from '../contrib/WebARRocksFace/helpers/WebARRocksMirror.js'

// ASSETS - Glasses:
import GLTFGlasses1 from '../../assets/VTOGlasses/models3D/glasses1.glb'
import GLTFGlasses2 from '../../assets/VTOGlasses/models3D/glasses2.glb'
import GLTFGlassesOccluder from '../../assets/VTOGlasses/models3D/occluder.glb'

// ASSETS - Hats:
import GLTFHat1 from '../../assets/VTOHelmet/models3D/hat.glb'
import GLTFHatOccluder from '../../assets/VTOHelmet/models3D/occluder.glb'

// import envMap:
import envMap from '../../assets/VTOGlasses/envmaps/venice_sunset_1k.hdr'

let _threeFiber = null

// Helper component: grabs R3F context and updates mirror each frame
const ThreeGrabber = (props) => {
  const threeFiber = useThree()
  _threeFiber = threeFiber

  useFrame(mirrorHelper.update.bind(null, props.sizing, threeFiber.camera))
  mirrorHelper.set_lighting(threeFiber.gl, threeFiber.scene, props.lighting)

  return null
}

const VTOModelContainer = (props) => {
  mirrorHelper.clean()

  const objRef = useRef()
  const innerGroupRef = useRef()

  // Prepare pose/following once the model is available

  useEffect(() => {
    const threeObject3DParent = objRef.current
    if (threeObject3DParent.children.length === 0) return
    const threeObject3D = threeObject3DParent.children[0]
    if (threeObject3D.children.length === 0) return
    const model = threeObject3D.children[0]

    if (props.isGlasses) {
      mirrorHelper.set_glassesPose(model)
      mirrorHelper.tweak_materials(model, props.glassesBranches)
    }

    mirrorHelper.set_faceFollower(threeObject3DParent, threeObject3D, props.faceIndex)
  }, [props.GLTFModel, props.sizing, props.hatConfig])

  // Get main model
  const model = props.GLTFModel.scene.clone()

  // For hats, adjust position manually relative to head/forehead area
  if (!props.isGlasses && props.hatConfig) {
    model.position.set(
      props.hatConfig.xOffset || 0,     // X: left-right
      props.hatConfig.yOffset || 210,    // Y: up for forehead/top of head
      props.hatConfig.zOffset || 0      // Z: forward-backward
    )
    model.scale.set(
      props.hatConfig.scale || 1.05,
      props.hatConfig.scale || 1.05,
      props.hatConfig.scale || 1.05
    )
  }

  // Create occluder mesh
  const isDebugOccluder = false
  const occluderModel = props.GLTFOccluderModel.scene.clone()
  const occluderMesh = mirrorHelper.create_occluderMesh(occluderModel, isDebugOccluder)



  return (
    <object3D ref={objRef}>
      <object3D ref={innerGroupRef}>
        <primitive object={model} />
        <primitive object={occluderMesh} />
      </object3D>
    </object3D>
  )
}

const DebugCube = () => {
  return (
    <mesh name="debugCube">
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  )
}

function AllInOne() {
  // refs:
  const canvasFaceRef = useRef()
  const cameraContainerRef = useRef()

  // state:
  const [isInitialized, setIsInitialized] = useState(false)
  const [model, setModel] = useState(null)
  const [currentType, setCurrentType] = useState('glasses') // 'glasses' or 'hat'
  const [uploadedGlassesModels, setUploadedGlassesModels] = useState([])
  const [uploadedHatModels, setUploadedHatModels] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  // Fixed hat positioning configuration with actual working values
  const hatConfig = {
    yOffset: 210,    // Fixed Y-axis position (actual working value)
    xOffset: 0,      // X-axis position (horizontal - left to right)
    zOffset: 0,      // Z-axis position (depth - forward/backward)
    scale: 1.05      // Fixed scale factor (actual working value: 1.05x)
  }

  // settings:
  const _settings = {
    lighting: {
      envMapIntensity: 0.8,
      pointLightIntensity: 0.8,
      pointLightY: 200,
      hemiLightIntensity: 0.8
    },
    bloom: {
      threshold: 0.99,
      intensity: 10,
      kernelSizeLevel: 3, // 0: 23x23, 1: 35x35, 2: 51x51, 3: 71x71, 4: 95x95
      computeScale: 0.5,
      luminanceSmoothing: 0.08
    },
    glassesBranches: {
      bendingAngle: 60,
      bendingZ: -23,
      fadingZ: -25,
      fadingTransition: 10
    }
  }

  // Load all models at component level
  const GLTFOccluderModel = useLoader(GLTFLoader, GLTFGlassesOccluder)
  const GLTFHatOccluderModel = useLoader(GLTFLoader, GLTFHatOccluder)
  const GLTFGlasses1Model = useLoader(GLTFLoader, GLTFGlasses1)
  const GLTFGlasses2Model = useLoader(GLTFLoader, GLTFGlasses2)
  const GLTFHat1Model = useLoader(GLTFLoader, GLTFHat1)

  // Responsive sizing driven by the actual camera container size
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })
  const [screen, setScreen] = useState({ width: window.innerWidth })
  useEffect(() => {
    const onResize = () => setScreen({ width: window.innerWidth })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  useEffect(() => {
    const el = cameraContainerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const cr = e.contentRect
        setContainerSize({ width: Math.floor(cr.width), height: Math.floor(cr.height) })
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const isMobile = screen.width <= 900

  const sizing = useMemo(() => ({
    width: Math.max(1, containerSize.width),
    height: Math.max(1, containerSize.height),
    top: 0,
    left: 0
  }), [containerSize.width, containerSize.height])

  // Set different models based on type
  const setGlassesModel = (gltfModel) => {
    setCurrentType('glasses')
    setModel(gltfModel)
  }

  const setHatModel = (gltfModel) => {
    setCurrentType('hat')
    setModel(gltfModel)
  }

  const clearModel = () => {
    setModel(null)
  }

  // File upload handlers
  const handleFileUpload = async (file, type) => {
    if (!file) {
      alert('Please select a file')
      return
    }



    // Check file type - accept .glb files regardless of MIME type
    const isValidFile = file.name.toLowerCase().endsWith('.glb')

    if (!isValidFile) {
      alert(`Please upload a valid GLB file (.glb extension). Current file: ${file.name}`)
      return
    }

    // Check file size (limit to 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File is too large. Please upload a file smaller than 50MB.')
      return
    }

    setIsUploading(true)
    
    try {
      const fileURL = URL.createObjectURL(file)
      const loader = new GLTFLoader()
      

      
      // Load the uploaded model with a timeout
      const gltfModel = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Loading timeout'))
        }, 30000) // 30 second timeout
        
        loader.load(
          fileURL,
          (gltf) => {
            clearTimeout(timeout)

            resolve(gltf)
          },
          (progress) => {

          },
          (error) => {
            clearTimeout(timeout)

            reject(error)
          }
        )
      })

      // Create a model object with name and model
      const uploadedModel = {
        name: file.name.replace('.glb', ''),
        model: gltfModel,
        url: fileURL
      }

      if (type === 'glasses') {
        setUploadedGlassesModels(prev => [...prev, uploadedModel])

        alert(`Successfully uploaded glasses: ${uploadedModel.name}`)
      } else if (type === 'hat') {
        setUploadedHatModels(prev => [...prev, uploadedModel])

        alert(`Successfully uploaded hat: ${uploadedModel.name}`)
      }
    } catch (error) {

      alert(`Error loading the uploaded model: ${error.message}. Please check if it's a valid GLB file.`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleGlassesUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      handleFileUpload(file, 'glasses')
    }
    // Reset the input so the same file can be uploaded again if needed
    event.target.value = ''
  }

  const handleHatUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      handleFileUpload(file, 'hat')
    }
    // Reset the input so the same file can be uploaded again if needed
    event.target.value = ''
  }

  // init:
  useEffect(() => {
    let isMounted = true
    let isDestroying = false

    const initializeWebAR = async () => {
      try {
        if (!isMounted || isDestroying) return

        // Start with glasses neural network for initial load
        const NN = NN_GLASSES

        await mirrorHelper.init({
          NN,
          canvasFace: canvasFaceRef.current,
          maxFacesDetected: 1,
          scanSettings: {
            threshold: 0.8, // detection threshold, between 0 and 1
          },
        })

        if (isMounted && !isDestroying) {
          setIsInitialized(true)
        }
      } catch (err) {
        if (isMounted && !isDestroying && err !== 'ALREADY_INITIALIZED' && err !== 'ALREADY_DESTROYING') {
          console.error('WebAR initialization error:', err)
        }
      }
    }

    if (!isInitialized) {
      initializeWebAR()
    }

    return () => {
      isMounted = false
      isDestroying = true
      setIsInitialized(false)
      
      // Clean up uploaded model URLs
      uploadedGlassesModels.forEach(model => {
        if (model.url) {
          URL.revokeObjectURL(model.url)
        }
      })
      uploadedHatModels.forEach(model => {
        if (model.url) {
          URL.revokeObjectURL(model.url)
        }
      })
      
      // Only destroy if we're actually initialized
      if (isInitialized) {
        mirrorHelper.destroy().catch(() => {
          // Ignore destroy errors during cleanup
        })
      }
    }
  }, [])

  return (
    <div className={`appShell ${isMobile ? 'isMobile' : ''}`}>

      {/* Camera and AR Canvas Container */}
      <div ref={cameraContainerRef} className='leftPane'>
        <div className='cameraFrame'>
        {/* Canvas managed by three fiber, for AR: */}
        <Canvas className='mirrorX' style={{
          position: 'absolute',
          zIndex: 2,
          width: '100%',
          height: '100%'
        }}
        gl={{
          preserveDrawingBuffer: true // allow image capture
        }}
        >
          <ThreeGrabber sizing={sizing} lighting={_settings.lighting} />

          {model && (
            <Suspense fallback={<DebugCube />}>
              <VTOModelContainer
                sizing={sizing}
                GLTFModel={model}
                GLTFOccluderModel={currentType === 'glasses' ? GLTFOccluderModel : GLTFHatOccluderModel}
                faceIndex={0}
                isGlasses={currentType === 'glasses'}
                glassesBranches={_settings.glassesBranches}
                hatConfig={hatConfig} />
            </Suspense>
          )}

          <EffectComposer>
            <Bloom
              luminanceThreshold={_settings.bloom.threshold}
              luminanceSmoothing={_settings.bloom.luminanceSmoothing}
              intensity={_settings.bloom.intensity}
              kernelSize={_settings.bloom.kernelSizeLevel}
              height={_settings.bloom.computeScale * sizing.height}/>
          </EffectComposer>

        </Canvas>

        {/* Canvas managed by WebAR.rocks, just displaying the video (and used for WebGL computations) */}
        <canvas className='mirrorX' ref={canvasFaceRef} style={{
          position: 'absolute',
          zIndex: 1,
          width: '100%',
          height: '100%'
        }} width={sizing.width} height={sizing.height} />
        </div>
      </div>

      {/* Control Panel */}
      <div className='rightPane'>

        {/* Clear Selection */}
        <div className='panel'>
          <VTOButton onClick={clearModel}>🚫 Remove All</VTOButton>
        </div>

        {/* Glasses Selection */}
        <div className='panel'>
          <h3 className='panelTitle'>
            👓 Glasses {uploadedGlassesModels.length > 0 && `(+${uploadedGlassesModels.length} uploaded)`}
          </h3>

          <div className='buttonGroup'>
            <VTOButton onClick={() => setGlassesModel(GLTFGlasses1Model)}>Classic Glasses</VTOButton>
            <VTOButton onClick={() => setGlassesModel(GLTFGlasses2Model)}>Modern Glasses</VTOButton>
            
            {/* Uploaded Glasses */}
            {uploadedGlassesModels.map((uploadedModel, index) => (
              <VTOButton key={`glasses-${index}`} onClick={() => setGlassesModel(uploadedModel.model)}>
                📁 {uploadedModel.name}
              </VTOButton>
            ))}
            
            {/* Upload Button */}
            <div style={{ position: 'relative' }}>
              <input
                type="file"
                accept=".glb"
                onChange={handleGlassesUpload}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                  zIndex: 1
                }}
                id="glasses-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="glasses-upload"
                style={{
                  display: 'block',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  position: 'relative',
                  zIndex: 0
                }}
              >
                <VTOButton style={{
                  background: isUploading ? 'rgba(100, 100, 100, 0.5)' : 'rgba(0, 150, 0, 0.7)',
                  color: 'white',
                  pointerEvents: 'none'
                }}>
                  {isUploading ? '⏳ Uploading...' : '📤 Upload Glasses GLB'}
                </VTOButton>
              </label>
            </div>
          </div>
        </div>

        {/* Hat Selection */}
        <div className='panel'>
          <h3 className='panelTitle'>
            🤠 Hats {uploadedHatModels.length > 0 && `(+${uploadedHatModels.length} uploaded)`}
          </h3>

          <div className='buttonGroup'>
            <VTOButton onClick={() => setHatModel(GLTFHat1Model)}>🤠 Cowboy Hat</VTOButton>

            {/* Uploaded Hats */}
            {uploadedHatModels.map((uploadedModel, index) => (
              <VTOButton key={`hat-${index}`} onClick={() => setHatModel(uploadedModel.model)}>
                📁 {uploadedModel.name}
              </VTOButton>
            ))}


            {/* Upload Button */}
            <div style={{ position: 'relative' }}>
              <input
                type="file"
                accept=".glb"
                onChange={handleHatUpload}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                  zIndex: 1
                }}
                id="hat-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="hat-upload"
                style={{
                  display: 'block',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  position: 'relative',
                  zIndex: 0
                }}
              >
                <VTOButton style={{
                  background: isUploading ? 'rgba(100, 100, 100, 0.5)' : 'rgba(0, 100, 150, 0.7)',
                  color: 'white',
                  pointerEvents: 'none'
                }}>
                  {isUploading ? '⏳ Uploading...' : '📤 Upload Hat GLB'}
                </VTOButton>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllInOne