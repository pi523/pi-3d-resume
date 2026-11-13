# Blender 无头脚本：给 me.glb 的 body 网格加"摸猫"骨骼动画
# 用法: blender --background --python tools/rig-pet.py -- <in.glb> <out.glb>
# 思路：两根骨（root 全身 + hand 手部），顶点权重按手部球形区域平滑分配，
# hand 骨以"手腕后方"为轴心做小幅弧线摆动 → 自然抚摸；动画 24fps 全时间轴循环。
import bpy, sys, math
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:]
IN_GLB, OUT_GLB = argv[0], argv[1]

# ---- 配置（glTF Y-up 坐标，与网站 man 本地系一致）----
HAND_C_GLTF = Vector((-0.264, -0.437, 0.468))   # 手背中心（debug.html 拾取）
WRIST_GLTF = Vector((-0.36, -0.44, 0.40))       # 手腕（弧线轴心，手背后外侧）
RADIUS = 0.17                                    # 影响半径（含平滑衰减）
SWING_DEG = 14                                   # 摆动半幅（度）
LIFT_DEG = 4                                     # 抬手半幅（度）
STROKE_FRAMES = 48                               # 一个完整来回的帧数
FPS = 24

def g2b(v):  # glTF(Y-up) -> Blender(Z-up)
    return Vector((v.x, -v.z, v.y))

# 清场并导入
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.scene.render.fps = FPS
bpy.ops.import_scene.gltf(filepath=IN_GLB)

# 找 body 网格与场景总帧数（跟 CameraAction 对齐）
body = None
total_frames = 360
for o in bpy.data.objects:
    if o.type == 'MESH' and o.name.startswith('body'):
        body = o
for a in bpy.data.actions:
    if 'CameraAction' in a.name:
        total_frames = int(a.frame_range[1])
assert body, 'body mesh not found'
print('body:', body.name, 'total_frames:', total_frames)

hand_c = g2b(HAND_C_GLTF)
wrist = g2b(WRIST_GLTF)

# ---- 建骨架：root（原点竖直） + hand（手腕→手背） ----
arm_data = bpy.data.armatures.new('PetArm')
arm_obj = bpy.data.objects.new('PetArm', arm_data)
bpy.context.scene.collection.objects.link(arm_obj)
# 骨架与 body 同父级、同变换，保证蒙皮空间一致
arm_obj.parent = body.parent
arm_obj.matrix_local = body.matrix_local.copy()
bpy.context.view_layer.objects.active = arm_obj
bpy.ops.object.mode_set(mode='EDIT')
eb_root = arm_data.edit_bones.new('Root')
eb_root.head = Vector((0, 0, -1.0))
eb_root.tail = Vector((0, 0, 1.0))
# hand 骨在 body 本地空间：把 man 本地坐标转到 body 本地
inv = body.matrix_local.inverted()
h_head = inv @ wrist
h_tail = inv @ hand_c
eb_hand = arm_data.edit_bones.new('Hand')
eb_hand.head = h_head
eb_hand.tail = h_tail + (h_tail - h_head) * 0.6
eb_hand.parent = eb_root
bpy.ops.object.mode_set(mode='OBJECT')

# ---- 顶点组：Hand = 球形平滑权重，Root = 其余 ----
vg_hand = body.vertex_groups.new(name='Hand')
vg_root = body.vertex_groups.new(name='Root')
mesh = body.data
c_local = inv @ hand_c
r_local = RADIUS / max(body.matrix_local.to_scale().x, 1e-6)
inner, outer = r_local * 0.35, r_local
n_hand = 0
for v in mesh.vertices:
    d = (v.co - c_local).length
    if d >= outer:
        vg_root.add([v.index], 1.0, 'REPLACE')
    else:
        t = max(0.0, min(1.0, (d - inner) / (outer - inner)))
        w = 1.0 - (t * t * (3 - 2 * t))  # smoothstep 反转
        vg_hand.add([v.index], w, 'REPLACE')
        vg_root.add([v.index], 1.0 - w, 'REPLACE')
        n_hand += 1
print('hand-weighted verts:', n_hand)

# 绑定：armature modifier（保留原变换）
body.parent = arm_obj
body.matrix_local = arm_obj.matrix_local.inverted() @ body.matrix_world
mod = body.modifiers.new('PetArm', 'ARMATURE')
mod.object = arm_obj

# ---- 动画：hand 骨局部欧拉摆动，正弦节奏铺满全时间轴 ----
bpy.context.view_layer.objects.active = arm_obj
bpy.ops.object.mode_set(mode='POSE')
pb = arm_obj.pose.bones['Hand']
pb.rotation_mode = 'XYZ'
action = bpy.data.actions.new('petAction')
if not arm_obj.animation_data:
    arm_obj.animation_data_create()
arm_obj.animation_data.action = action
half = STROKE_FRAMES // 2
f = 0
i = 0
while f <= total_frames:
    ph = i % 2  # 0=去 1=回
    swing = math.radians(SWING_DEG) * (1 if ph == 0 else -1)
    lift = math.radians(LIFT_DEG) * (0.3 if ph == 0 else 1.0)
    pb.rotation_euler = (lift, 0, swing)
    pb.keyframe_insert('rotation_euler', frame=f)
    f += half
    i += 1
bpy.ops.object.mode_set(mode='OBJECT')
# F 曲线平滑（默认 bezier 已足够）

# ---- 导出 ----
bpy.ops.export_scene.gltf(
    filepath=OUT_GLB,
    export_format='GLB',
    export_animations=True,
    export_animation_mode='ACTIONS',
    export_skins=True,
    export_yup=True,
    export_image_format='WEBP',
    export_extras=True,
    export_cameras=True,
)
print('exported:', OUT_GLB)
