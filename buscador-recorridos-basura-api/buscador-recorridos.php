<?php
/*
Plugin Name: Buscador recorridos de basura API
Plugin URI: https://github.com/ModernizacionMuniCBA/
Description: Este plugin muestra el listado de empresas por barrio y tipo de recoleccion. Filtra por barrio desde API [muestra_recorrido_api]
Version: 3.0.1
Author: Sistemas-Prensa
Author URI: https://github.com/perloignacio
*/

setlocale(LC_ALL,"es_ES");
date_default_timezone_set('America/Argentina/Cordoba');
add_action('plugins_loaded', array('buscador_recorridos', 'get_instancia'));


//ordena alfabeticamente array de barrios
function barrios_sort($a, $b) {
    return strcmp($a["nombre"], $b["nombre"]);
}

class buscador_recorridos
{
	public static $instancia = null;
	
	public static function get_instancia() {
		if (null == self::$instancia) {
			self::$instancia = new buscador_recorridos();
		} 
		return self::$instancia;
	}
	private function __construct()
		{
			
			
			add_shortcode('muestra_recorrido', array($this, 'render_shortcode_muestra_recorrido'));		
			add_action('wp_enqueue_scripts', array($this, 'cargar_assets_basura'));
			// add_action('wp_enqueue_scripts', array($this, 'custom_dequeue'));
			// add_action('init', array($this, 'boton_shortcode_muestra_recorrido'));
			//add_filter( 'script_loader_tag', 'cameronjonesweb_add_script_handle', 10, 3 );
			// add_action( 'wp_head', 'custom_dequeue', 9999 );
		}

		public function cargar_assets_basura()
		{
			$urlbasura_shortcode = $this->cargar_url_basura('/css/shortcode-basura.css');
			 wp_register_style('buscador_recorrido_css', $urlbasura_shortcode);
			 wp_enqueue_style('buscador_recorrido_css', $urlbasura_shortcode);
			 
			 $urlJSbasura = $this->cargar_url_basura('/js/cargar-recorrido.js');
			 
			 wp_register_script('buscador_recorrido', $urlJSbasura,null,false,false);
			 wp_enqueue_script('buscador_recorrido',$urlJSbasura,null,false,false);
		}

		private function cargar_url_basura($ruta_archivo)
		{
			return plugins_url($ruta_archivo, __FILE__);
		}

		public function render_shortcode_muestra_recorrido()
		{
			$URL = "https://gobiernoabierto.cordoba.gob.ar/api/v2/recoleccion-de-residuos/barrio-recoleccion/?page_size=800";
			$api_response = wp_remote_get($URL);
			if (is_null($api_response)) {
				echo("vacio");
			} else if (is_wp_error($api_response)) {
				$mensaje = $this->mostrar_error($api_response);
				var_dump($mensaje);
			} else {
				$arraya = (array) json_decode(wp_remote_retrieve_body($api_response), true);
			}
			// echo($arraya[2]);
			$obj=$arraya['results'];
			$barrios = array();
			//obtener los nombres barrios y ordenar
			for ($c=1; $c < count($obj)-1; $c++) {
				array_push($barrios,($obj[$c]));
			}
			usort($barrios,"barrios_sort");
			//print_r($barrios);


			//muestro barrios
				$sc='<div id="buscador">
					<div class="campo">
						<select id="barrios" onchange="javascript:filtra_recorrido()">
							<option value="">Seleccione el barrio</option>
							';
								foreach($barrios as $barrio)
								{
									$sc.="<option value='".$barrio["id"]."'>".ucwords($barrio["nombre"])."</option>";
								}
							$sc.='
						</select>
					</div>
				</div>';

			$URL = "https://gobiernoabierto.cordoba.gob.ar/api/v2/recoleccion-de-residuos/zona-recoleccion/?page_size=800";
			$api_response = wp_remote_get($URL);
			$recorridos=json_decode(wp_remote_retrieve_body($api_response), true);
			

			$sc.='<div class="resultado__container">
					<div id="loading"><img src="'.plugin_dir_url( __FILE__ ).'images/loading.gif" /></div>
					<div id="resultados"></div>
				</div>';
			$sc.='<script type="text/javascript">
					var lista;
					var data_filter;
					lista='.json_encode($recorridos['results']).';';

					$sc.='filtra_recorrido();
					</script>';
			return $sc;
			
		}
}
?>