using UnityEngine;
using System.Collections;

public class DepthMask : MonoBehaviour {
 
	[SerializeField]
	protected int[] m_queues = new int[]{3000};
 
	protected void Awake() {
		Material[] materials = renderer.materials;
		for (int i = 0; i < materials.Length && i < m_queues.Length; ++i) {
			materials[i].renderQueue = m_queues[i];
		}
	}
}