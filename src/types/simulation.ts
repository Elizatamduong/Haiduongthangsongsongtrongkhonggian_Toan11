export type SceneId =
  | 'intro'
  | 'scene1_relative_positions'
  | 'scene2_parallel_property'
  | 'scene3_concurrence'
  | 'scene4_parallel_planes'
  | 'scene5_real_door'
  | 'scene6_real_truss'
  | 'scene7_real_planes'
  | 'summary';

export type CameraPreset = 'perspective' | 'top' | 'front' | 'side';

export interface SceneMeta {
  id: SceneId;
  title: string;
  shortTitle: string;
  badge: string;
  description: string;
}

export type Scene1State = 'intersecting' | 'parallel' | 'skew';

export type Scene3Step = 1 | 2 | 3 | 4; // 1: plane P & Q (line a), 2: Q & R (line b), 3: R & P (line c), 4: point O revealed

export type Scene4Step = 1 | 2 | 3 | 4; // Progressive lines a, b, c then summary

export type Scene7Mode = 'apex' | 'prism';
