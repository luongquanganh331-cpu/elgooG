
import React, { useEffect, useRef } from 'react';
import { AppMode } from '../types';

declare const Matter: any;

export const PhysicsLayer: React.FC<{ mode: AppMode }> = ({ mode }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<any>(null);
  const active = mode === AppMode.GRAVITY || mode === AppMode.SPRING;

  useEffect(() => {
    if (!active || !sceneRef.current) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Constraint } = Matter;

    const engine = Engine.create();
    engineRef.current = engine;
    
    if (mode === AppMode.SPRING) {
      engine.gravity.y = 0;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent'
      }
    });

    const ground = Bodies.rectangle(width / 2, height + 30, width, 60, { isStatic: true });
    const leftWall = Bodies.rectangle(-30, height / 2, 60, height, { isStatic: true });
    const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height, { isStatic: true });
    
    Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Add elements
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * width;
      const y = Math.random() * (mode === AppMode.SPRING ? height : -500);
      const size = 30 + Math.random() * 40;
      const color = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'][Math.floor(Math.random() * 4)];
      
      const body = Bodies.rectangle(x, y, size, size, {
        restitution: 0.8,
        render: { fillStyle: color }
      });

      if (mode === AppMode.SPRING) {
        const spring = Constraint.create({
          pointA: { x, y },
          bodyB: body,
          stiffness: 0.02,
          damping: 0.05,
          render: { visible: true, strokeStyle: color + '44' }
        });
        Composite.add(engine.world, [body, spring]);
      } else {
        Composite.add(engine.world, body);
      }
    }

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Composite.add(engine.world, mouseConstraint);

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const handleResize = () => {
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
      Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 30 });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [active, mode]);

  if (!active) return null;

  return (
    <div 
      ref={sceneRef} 
      className="fixed inset-0 pointer-events-auto z-10" 
      style={{ background: 'rgba(255,255,255,0.02)' }}
    />
  );
};
