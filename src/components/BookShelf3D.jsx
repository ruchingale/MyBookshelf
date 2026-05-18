import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import { titleToHsl } from '../lib/bookUtils'

function Book3D({ book, position, onClick }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const color = titleToHsl(book.title)
  const width = Math.min(0.6, Math.max(0.3, 0.03 * book.title.length))

  useFrame(() => {
    if (ref.current) {
      const target = hovered ? -0.1 : 0
      ref.current.position.z += (target - ref.current.position.z) * 0.1
    }
  })

  return (
    <mesh 
      position={position} 
      ref={ref} 
      onClick={(e)=>{e.stopPropagation(); onClick(book)}}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      castShadow
    >
      <boxGeometry args={[width, 1.2, 0.2]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.6} />
    </mesh>
  )
}

function ShelfRow({ books, y, onClick }) {
  const shelfWidth = 8 * 0.6 + 7 * 0.05
  const startX = -shelfWidth / 2 + 0.3
  return (
    <group>
      {books.map((book, i) => {
        const x = startX + i * 0.65
        return <Book3D key={book.id} book={book} position={[x, y, 0]} onClick={onClick} />
      })}
      <mesh position={[0, y - 0.75, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[shelfWidth + 0.6, 0.1, 0.6]} />
        <meshStandardMaterial color={'#8B5E3C'} metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh position={[0, y - 0.75, -0.4]} castShadow>
        <boxGeometry args={[0.15, 1.2, 0.05]} />
        <meshStandardMaterial color={'#6B4423'} />
      </mesh>
      <mesh position={[0, y - 0.75, 0.3]} castShadow>
        <boxGeometry args={[0.15, 1.2, 0.05]} />
        <meshStandardMaterial color={'#6B4423'} />
      </mesh>
    </group>
  )
}

function BackWall() {
  return (
    <mesh position={[0, 0, -1]} receiveShadow>
      <planeGeometry args={[10, 8]} />
      <meshStandardMaterial color={'#1a1a1a'} />
    </mesh>
  )
}

export default function BookShelf3D({ books, onBookClick }) {
  const rows = useMemo(() => {
    const perRow = 8
    const out = []
    for (let i = 0; i < books.length; i += perRow) out.push(books.slice(i, i + perRow))
    return out
  }, [books])

  return (
    <div className="w-full h-[700px] rounded-xl overflow-hidden border border-white/10">
      <Canvas shadows camera={{ position: [0, 2, 6], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[8, 10, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={20}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-5, 5, 3]} intensity={0.3} />
        
        <BackWall />
        
        <OrbitControls 
          minPolarAngle={0.6} 
          maxPolarAngle={1.6} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5}
          enableZoom={true}
          enableDamping={true}
          dampingFactor={0.05}
        />
        
        <group position={[0, 0, 0]}>
          {rows.map((r, idx) => (
            <ShelfRow key={idx} books={r} y={1.5 - idx * 1.5} onClick={onBookClick} />
          ))}
        </group>
        
        <fog attach="fog" args={['#0f0f0f', 5, 20]} />
      </Canvas>
    </div>
  )
}
