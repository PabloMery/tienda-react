
import React, { useState, useEffect } from "react";
import "../styles/Registro.css";
import { useNavigate } from "react-router-dom";
import { useRegistro } from "../context/RegistroContext";

export default function Registro() {
  // ====== ESTADOS (persisten en localStorage) ======
  const [nombre, setNombre]       = useState(localStorage.getItem("nombre") || "");
  const [correo, setCorreo]       = useState(localStorage.getItem("correo") || "");
  const [contrasena, setContrasena] = useState(localStorage.getItem("contrasena") || "");
  const [confirmar, setConfirmar] = useState(localStorage.getItem("confirmar") || "");
  const [telefono, setTelefono]   = useState(localStorage.getItem("telefono") || "");
  const [region, setRegion]       = useState(localStorage.getItem("region") || "");
  const [comuna, setComuna]       = useState(localStorage.getItem("comuna") || "");

  // ====== MAPA REGIONES/COMUNAS ======
  const comunasPorRegion = {
    "Arica y Parinacota": ["Arica", "Camarones", "General Lagos", "Putre"],
    "Tarapacá": ["Alto Hospicio","Camiña","Colchane","Huara","Iquique","Pica","Pozo Almonte"],
    "Antofagasta": ["Antofagasta","Calama","María Elena","Mejillones","Ollagüe","San Pedro de Atacama","Sierra Gorda","Taltal","Tocopilla"],
    "Atacama": ["Alto del Carmen","Caldera","Chañaral","Copiapó","Diego de Almagro","Freirina","Huasco","Tierra Amarilla","Vallenar"],
    "Coquimbo": ["Andacollo","Canela","Combarbalá","Coquimbo","Illapel","La Higuera","La Serena","Los Vilos","Monte Patria","Ovalle","Paihuano","Punitaqui","Río Hurtado","Salamanca","Vicuña"],
    "Valparaíso": ["Algarrobo","Cabildo","Calle Larga","Cartagena","Casablanca","Catemu","Concón","El Quisco","El Tabo","Hijuelas","Isla de Pascua","Juan Fernández","La Calera","La Cruz","La Ligua","Limache","Llaillay","Los Andes","Nogales","Olmué","Panquehue","Papudo","Petorca","Puchuncaví","Putaendo","Quillota","Quilpué","Quintero","Rinconada","San Antonio","San Esteban","San Felipe","Santa María","Santo Domingo","Valparaíso","Villa Alemana","Viña del Mar","Zapallar"],
    "Metropolitana de Santiago": ["Alhué","Buin","Calera de Tango","Cerrillos","Cerro Navia","Colina","Conchalí","Curacaví","El Bosque","El Monte","Estación Central","Huechuraba","Independencia","Isla de Maipo","La Cisterna","La Florida","La Granja","Lampa","La Pintana","La Reina","Las Condes","Lo Barnechea","Lo Espejo","Lo Prado","Macul","Maipú","María Pinto","Melipilla","Ñuñoa","Padre Hurtado","Paine","Pedro Aguirre Cerda","Peñaflor","Peñalolén","Pirque","Providencia","Pudahuel","Puente Alto","Quilicura","Quinta Normal","Recoleta","Renca","San Bernardo","San Joaquín","San José de Maipo","San Miguel","San Pedro","San Ramón","Santiago","Talagante","Tiltil","Vitacura"],
    "Libertador General Bernardo O'Higgins": ["Chépica","Chimbarongo","Codegua","Coinco","Coltauco","Doñihue","Graneros","La Estrella","Las Cabras","Litueche","Lolol","Machalí","Malloa","Marchihue","Mostazal","Nancagua","Navidad","Olivar","Palmilla","Paredones","Peralillo","Peumo","Pichidegua","Pichilemu","Placilla","Pumanque","Quinta de Tilcoco","Rancagua","Rengo","Requínoa","San Fernando","Santa Cruz","San Vicente"],
    "Maule": ["Cauquenes","Chanco","Colbún","Constitución","Curepto","Curicó","Empedrado","Hualañé","Licantén","Linares","Longaví","Maule","Molina","Parral","Pelarco","Pelluhue","Pencahue","Rauco","Retiro","Río Claro","Romeral","Sagrada Familia","San Clemente","San Javier","San Rafael","Talca","Teno","Vichuquén","Villa Alegre","Yerbas Buenas"],
    "Ñuble": ["Bulnes","Chillán","Chillán Viejo","Cobquecura","Coelemu","Coihueco","El Carmen","Ninhue","Ñiquén","Pemuco","Pinto","Portezuelo","Quillón","Quirihue","Ránquil","San Carlos","San Fabián","San Ignacio","San Nicolás","Treguaco","Yungay"],
    "Biobío": ["Alto Biobío","Antuco","Arauco","Cabrero","Cañete","Chiguayante","Concepción","Contulmo","Coronel","Curanilahue","Florida","Hualpén","Hualqui","Laja","Lebu","Los Álamos","Los Ángeles","Lota","Mulchén","Nacimiento","Negrete","Penco","Quilaco","Quilleco","San Pedro de la Paz","San Rosendo","Santa Bárbara","Santa Juana","Talcahuano","Tirúa","Tomé","Tucapel","Yumbel"],
    "La Araucanía": ["Angol","Carahue","Cholchol","Collipulli","Cunco","Curacautín","Curarrehue","Ercilla","Freire","Galvarino","Gorbea","Lautaro","Loncoche","Lonquimay","Los Sauces","Lumaco","Melipeuco","Nueva Imperial","Padre Las Casas","Perquenco","Pitrufquén","Pucón","Purén","Renaico","Saavedra","Temuco","Teodoro Schmidt","Toltén","Traiguén","Victoria","Vilcún","Villarrica"],
    "Los Ríos": ["Corral","Futrono","Lago Ranco","Lanco","La Unión","Los Lagos","Máfil","Mariquina","Paillaco","Panguipulli","Río Bueno","Valdivia"],
    "Los Lagos": ["Ancud","Calbuco","Castro","Chaitén","Chonchi","Cochamó","Curaco de Vélez","Dalcahue","Fresia","Frutillar","Futaleufú","Hualaihué","Llanquihue","Los Muermos","Maullín","Osorno","Palena","Puerto Montt","Puerto Octay","Puerto Varas","Puqueldón","Purranque","Puyehue","Queilén","Quellón","Quemchi","Quinchao","Río Negro","San Juan de la Costa","San Pablo"],
    "Aysén del General Carlos Ibáñez del Campo": ["Aysén","Chile Chico","Cisnes","Cochrane","Coyhaique","Guaitecas","Lago Verde","O'Higgins","Río Ibáñez","Tortel"],
    "Magallanes y de la Antártica Chilena": ["Antártica","Cabo de Hornos","Laguna Blanca","Natales","Porvenir","Primavera","Punta Arenas","Río Verde","San Gregorio","Timaukel","Torres del Paine"]
  };

  // ====== LOCAL STORAGE ======
  useEffect(()=>{ localStorage.setItem("nombre", nombre); }, [nombre]);
  useEffect(()=>{ localStorage.setItem("correo", correo); }, [correo]);
  useEffect(()=>{ localStorage.setItem("contrasena", contrasena); }, [contrasena]);
  useEffect(()=>{ localStorage.setItem("confirmar", confirmar); }, [confirmar]);
  useEffect(()=>{ localStorage.setItem("telefono", telefono); }, [telefono]);
  useEffect(()=>{ localStorage.setItem("region", region); }, [region]);
  useEffect(()=>{ localStorage.setItem("comuna", comuna); }, [comuna]);
  
  // ====== HANDLERS ======
  const handleRegionChange = (e) => {
    const value = e.target.value;
    setRegion(value);
    setComuna("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registro guardado correctamente ✅");
  };

  // ====== RENDER ======
  return (
    <main className="wrap page-registro">
      <div className="registro__container">
        <header className="form-header">
          <h1>Registro de usuarios</h1>
        </header>

        <form className="formulario" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input type="text" id="nombre" placeholder="Pedrito Soto"
              value={nombre} onChange={(e)=>setNombre(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo</label>
            <input type="email" id="correo" placeholder="pedrito@gmail.com"
              value={correo} onChange={(e)=>setCorreo(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input type="password" id="contrasena" placeholder="*****"
              value={contrasena} onChange={(e)=>setContrasena(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="confi_contrasena">Confirmar contraseña</label>
            <input type="password" id="confi_contrasena" placeholder="*****"
              value={confirmar} onChange={(e)=>setConfirmar(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono (opcional)</label>
            <input type="tel" id="telefono" placeholder="123456789"
              value={telefono} onChange={(e)=>setTelefono(e.target.value)} />
          </div>

          <div className="form-group fila">
            <div className="columna">
              <label htmlFor="region">Región</label>
              <select id="region" value={region} onChange={handleRegionChange}>
                <option value="" disabled>Seleccione su región</option>
                {Object.keys(comunasPorRegion).map((reg)=>(
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>

            <div className="columna">
              <label htmlFor="comuna">Comuna</label>
              <select id="comuna" value={comuna}
                      onChange={(e)=>setComuna(e.target.value)} disabled={!region}>
                <option value="" disabled>
                  {region ? "Seleccione su comuna" : "Seleccione una región primero"}
                </option>
                {region && comunasPorRegion[region]?.map((c)=>(
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-registrar">Registrar</button>
        </form>
      </div>
    </main>
  );
}
