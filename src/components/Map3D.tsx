import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import type { FirebaseShop } from '../types/firebase';

interface ShopMarker3DProps {
  shop: FirebaseShop;
  onClick: () => void;
}

function ShopMarker3D({ shop, onClick }: ShopMarker3DProps) {
  return (
    <group
      position={[
        shop.location.position3D.x,
        shop.location.position3D.y,
        shop.location.position3D.z
      ]}
      onClick={onClick}
    >
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="indigo" />
      </mesh>
      <Text
        position={[0, 2, 0]}
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {shop.name}
      </Text>
    </group>
  );
}

interface Map3DProps {
  shops: FirebaseShop[];
  onShopSelect: (shop: FirebaseShop) => void;
}

export function Map3D({ shops, onShopSelect }: Map3DProps) {
  return (
    <div className="h-[60vh] w-full rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 15, 35] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Floor grid */}
        <gridHelper args={[100, 100]} />
        
        {/* Shop markers */}
        {shops.map((shop) => (
          <ShopMarker3D
            key={shop.id}
            shop={shop}
            onClick={() => onShopSelect(shop)}
          />
        ))}
        
        <OrbitControls />
      </Canvas>
    </div>
  );
}