import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Col,
  Container,
  Row,
  CardBody,
  Button,
  Form,
  Input,
  Modal,
  Spinner,
  CardTitle,
  FormFeedback,
} from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';

import Select from "react-select";

// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

import draftToHtml from 'draftjs-to-html';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

// actions
import { getTypesHomework, getClientUsers, getZones, getProperties, getHomeworks, createHomework, createHomeworkMassive, editHomework, deleteHomework, deleteHomeworkMassive } from "../../../store/actions";

//redux
import { useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

const IndexTareas = props => {
  //meta title
  document.title = "Tareas | Maximo PH";

  const dispatch = useDispatch();

  const initialValuesHomeWork = {
    'tarea-fecha-programada-inicial': '',
    'tarea-fecha-programada-final': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingText, setLoadingText] = useState('Cargando ...');

  const [tipoTarea, setTipoTarea] = useState(null);
  const [dataTiposTarea, setDataTiposTarea] = useState(null);

  const [dataTareas, setDataTareas] = useState([]);
  const [dataTareasFiltered, setDataTareasFiltered] = useState([]);

  const [user, setUser] = useState(null);
  const [dataUsers, setDataUsers] = useState([]);

  const [estado, setEstado] = useState({ label: "PENDIENTE", value: "0" });
  
  const [prioridad, setPrioridad] = useState({ label: "BAJA", value: "0" });

  const [zone, setZone] = useState(null);
  const [dataZones, setDataZones] = useState([]);

  const [property, setProperty] = useState(null);
  const [dataProperties, setDataProperties] = useState([]);
  
  const [modalViewTarea, setModalViewTarea] = useState(null);
  
  const [editTareaId, setEditTarea] = useState(false);
  const [descripcion, setDescripcion] = useState(EditorState.createEmpty());
  const [confirmEliminarTarea, setConfirmEliminarTarea] = useState(false);
  const [confirmModalEliminarTarea, setConfirmModalEliminarTarea] = useState(false);

  //FILTRAR TAREAS
  const [userTareaFiltro, setUserTareaFiltro] = useState({label: 'TODOS', value: '0'});
  const [programadaFinalTareaFiltro, setProgramadaFinalTareaFiltro] = useState('');
  const [programadaInicialTareaFiltro, setProgramadaInicialTareaFiltro] = useState('');
  const [estadoTareaFiltro, setEstadoTareaFiltro] = useState({ label: "TODOS", value: "3" });
  const [aTiempoTareaFiltro, setATiempoTareaFiltro] = useState({ label: "TODOS", value: "4" });
  const [prioridadTareaFiltro, setPrioridadTareaFiltro] = useState({ label: "TODAS", value: "4" });
  
  //CREAR TAREAS MASIVAMENTE
  const [loadingMasivo, setLoadingMasivo] = useState(false);
  const [tipoTareaMasiva, setTipoTareaMasiva] = useState(null);
  const [userTareaMasiva, setUserTareaMasiva] = useState(null);
  const [prioridadTareaMasiva, setPrioridadTareaMasiva] = useState({ label: "BAJA", value: "0" });
  const [diasTareaMasiva, setDiasTareaMasiva] = useState(null);
  const [descripcionTareaMasiva, setDescripcionTareaMasiva] = useState(EditorState.createEmpty());
  const [nuevaTareaMasiva, setNuevaTareaMasiva] = useState(false);
  
  //ELIMINAR TAREAS MASIVAMENTE
  const [tipoTareaEliminarMasiva, setTipoTareaEliminarMasiva] = useState(null);
  const [userTareaEliminarMasiva, setUserTareaEliminarMasiva] = useState(null);
  const [estadoTareaEliminarMasiva, setEstadoTareaEliminarMasiva] = useState({ label: "TODOS", value: "3" });
  const [eliminarTareaMasiva, setEliminarTareaMasiva] = useState(false);
  const [loadingEliminarTareaMasiva, setLoadingEliminarTareaMasiva] = useState(false);
  const [enableForm, setEnableForm] = useState(false);
  

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});

  const getDateDayName = (_date)=>{
    _date = new Date(_date);

    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb'];

    const dayOfWeekNumber = _date.getDay();

    return daysOfWeek[dayOfWeekNumber];
  }

  const editTareaFn = (tarea)=>{
    if(accessModule.ACTUALIZAR==true){
      let editTareaObj = {
        'tarea-fecha-programada-inicial': tarea.programada_at_init,
        'tarea-fecha-programada-final': tarea.programada_at_end
      };

      setEditTarea(Number(tarea.id));

      setTipoTarea({
        value: tarea.id_tipo_tarea,
        label: tarea.tipoTareaText
      });
      
      setUser({
        value: tarea.id_usuario_responsable,
        label: tarea.usuarioText
      });
      
      let estadoText = 'PENDIENTE';

      switch(tarea.estado){
        case 1: estadoText='COMPLETADA'; break;
        case 2: estadoText='CANCELADA'; break;
      }

      setEstado({
        value: tarea.estado,
        label: estadoText
      });

      let prioridadText = 'BAJA';

      switch(tarea.prioridad){
        case 1: prioridadText='MEDIA'; break;
        case 2: prioridadText='ALTA'; break;
      }

      setPrioridad({
        value: tarea.prioridad,
        label: prioridadText
      });

      if(tarea.id_inmueble_zona){
        setZone({
          value: tarea.id_inmueble_zona,
          label: tarea.zonaText
        });
      }
      
      if(tarea.id_inmueble){
        setProperty({
          value: tarea.id_inmueble,
          label: tarea.tipoInmuebleText+' '+tarea.inmuebleText
        });
      }
      
      if(tarea.descripcion_tarea){
        let contentRaw = JSON.parse(tarea.descripcion_tarea);
            contentRaw = convertFromRaw(contentRaw);
            contentRaw = EditorState.createWithContent(contentRaw);

        setDescripcion(contentRaw);
      }
      setEnableForm(true);

      setLoadingText('Editando tarea...');

      validation.setValues(editTareaObj);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar tareas", "Permisos");
    }
  };

  const deleteTareaModal = (tarea)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarTarea(tarea);
      setConfirmModalEliminarTarea(true);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar tareas", "Permisos");
    }
  };
  
  const deleteTareaConfirm = ()=>{
    cancelTarea();
    setConfirmEliminarTarea(false);
    setConfirmModalEliminarTarea(false);
    

    setLoadingText('Eliminando tarea...')

    dispatch(deleteHomework(confirmEliminarTarea.id, ()=>{
      cancelTarea();
      loadTareas();
      toastr.success("Tarea eliminada.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesHomeWork,
    validationSchema: Yup.object({
      'tarea-fecha-programada-inicial': Yup.string().required("Por favor ingrese la fecha programada inicial"),
      'tarea-fecha-programada-final': Yup.string().required("Por favor ingrese la fecha programada final")
    }),
    onSubmit: (values) => {
      let tareaValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('tarea-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","eliminado"].includes(fieldName)===false){
          tareaValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });

      if(!tipoTarea){
        toastr.error("Seleccione el tipo de tarea", "Error de validación");
        return;
      }

      if(!user){
        toastr.error("Seleccione el usuario", "Error de validación");
        return;
      }

      if(!estado){
        toastr.error("Seleccione el estado de la tarea", "Error de validación");
        return;
      }

      if(!prioridad){
        toastr.error("Seleccione la prioridad de la tarea", "Error de validación");
        return;
      }

      if(new Date(tareaValues["fecha_programada_inicial"])>new Date(tareaValues["fecha_programada_final"])){
        toastr.error("La fecha de programación inicial no puede ser mayor a la final", "Error de validación");
        return;
      }

      let descripcionTextarea = convertToRaw(descripcion.getCurrentContent());
      
      let validateDescriptionHomework = false;
      descripcionTextarea.blocks.map((block)=>{
        if((block?.text || '').trim()!='') validateDescriptionHomework = true;
      });
      if(!validateDescriptionHomework){
        toastr.error("Por favor digite la descripción de la tarea", "Error de validación");
        return;
      }

      let contentRaw = descripcionTextarea;
      contentRaw = JSON.stringify(contentRaw);

      tareaValues["id_tipo_tarea"] = tipoTarea.value;
      tareaValues["id_usuario_responsable"] = user.value;
      tareaValues["id_inmueble"] = property?.value;
      tareaValues["id_inmueble_zona"] = zone?.value;
      tareaValues["estado"] = estado.value;
      tareaValues["prioridad"] = prioridad.value;
      tareaValues["descripcion_tarea"] = contentRaw;
      
      setLoadingText("Guardando ...");

      if(!editTareaId){
        dispatch(createHomework(tareaValues, (response)=>{
          if(response.success){
            cancelTarea();
            loadTareas();
            toastr.success("Nueva tarea registrado.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }else{
        tareaValues["id"] = editTareaId;
        dispatch(editHomework(tareaValues, (response)=>{
          if(response.success){
            cancelTarea();
            loadTareas();
            toastr.success("Tarea editada.", "Operación Ejecutada");
          }else{
            setLoadingText("Editando tarea...");
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelTarea = ()=>{
    setUser(null);
    setZone(null);
    setProperty(null);
    setTipoTarea(null);
    setEditTarea(false);
    setEnableForm(false);
    setDescripcion(EditorState.createEmpty());
    setEstado({ label: "PENDIENTE", value: "0" });
    setPrioridad({ label: "BAJA", value: "0" });
    setLoadingText(false);
    validation.handleReset();
  };

  const viewTarea = (tarea)=>{
    let contentRaw = tarea.descripcion_tarea ? JSON.parse(tarea.descripcion_tarea) : '';
    if(tarea.descripcion_tarea){
        contentRaw = convertFromRaw(contentRaw);
        contentRaw = EditorState.createWithContent(contentRaw);
        contentRaw = draftToHtml(convertToRaw(contentRaw.getCurrentContent()));
    }

    let contentRawCompleted = tarea.observacion_completada ? JSON.parse(tarea.observacion_completada) : '';
    if(tarea.observacion_completada){
      contentRawCompleted = convertFromRaw(contentRawCompleted);
      contentRawCompleted = EditorState.createWithContent(contentRawCompleted);
      contentRawCompleted = draftToHtml(convertToRaw(contentRawCompleted.getCurrentContent()));
    }
      
    tarea.estadoText = 'PENDIENTE';

    switch(tarea.estado){
      case 1: tarea.estadoText='COMPLETADA'; break;
      case 2: tarea.estadoText='CANCELADA'; break;
    }

    tarea.prioridadText = 'BAJA';

    switch(tarea.prioridad){
      case 1: tarea.prioridadText='MEDIA'; break;
      case 2: tarea.prioridadText='ALTA'; break;
    }

    if(tarea.imagen){
      tarea.imagenView = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/homeworks/"+tarea.imagen;
    }

    let aTiempo = '-';
    let aTiempoColor = '';
    
    if(tarea.completada_at){
      if(new Date(tarea.completada_at)<=new Date(tarea.programada_at_end)){
        aTiempo = 'SI';
        aTiempoColor = 'text-primary';
      }else{
        aTiempo = 'NO';
        aTiempoColor = 'text-warning';
      }
    }else if(new Date()>new Date(tarea.programada_at_end)){
      aTiempo = 'EN MORA';
      aTiempoColor = 'error';
    }

    tarea.aTiempo = aTiempo;
    tarea.aTiempoColor = aTiempoColor;

    setModalViewTarea({titulo: tarea.tipoTareaText, descripcion: contentRaw, observacion_completada: contentRawCompleted, tarea});
  };
  
  const columns = useMemo(
    () => [
        {
          sticky: true,
          Header: 'Operaciones',
          accessor: row => {
            let classEditBtn = accessModule.ACTUALIZAR==true ? "success" : "secondary";
            let classDeleteBtn = accessModule.ELIMINAR==true ? "danger" : "secondary";
            
            return (<p className="text-center">
              <Button color={classEditBtn} className="btn-sm" onClick={()=>{editTareaFn(row)}}> 
                  <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop" style={{ color: 'white' }}>Editar</span>
              </Button>
              {' '}
              <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deleteTareaModal(row)}}> 
                  <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Eliminar</span>
              </Button>
              {' '}
              <Button color={'info'} className="btn-sm" onClick={()=>{viewTarea(row)}}> 
                  <i className="bx bx-view font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Ver Tarea</span>
              </Button>
            </p>)
          }
        },
        {
            Header: 'Tarea',
            accessor: 'tipoTareaText'
        },
        {
            Header: 'Estado',
            accessor: row => {
              let estado = 'PENDIENTE';

              switch(row.estado){
                case 1: estado='COMPLETADA'; break;
                case 2: estado='CANCELADA'; break;
                case 3: estado='INICIADA'; break;
              }
              
              return (<p className="text-center">{estado}</p>);
            }
        },
        {
            Header: 'Prioridad',
            accessor: row => {
              let prioridad = 'BAJA';

              switch(row.prioridad){
                case 1: prioridad='MEDIA'; break;
                case 2: prioridad='ALTA'; break;
              }
              
              return (<p className="text-center">{prioridad}</p>);
            }
        },
        {
            Header: 'Usuario Asignado',
            accessor: 'usuarioText',
        },
        {
            Header: 'Fecha Programación Inicial',
            accessor: row => {
              let dayName = getDateDayName(row.programada_at_init);
              return (<p className="text-center">{row.programada_at_init}, {dayName}</p>)
            }
        },
        {
            Header: 'Fecha Programación Final',
            accessor: row => {
              let dayName = getDateDayName(row.programada_at_end);
              return (<p className="text-center">{row.programada_at_end}, {dayName}</p>)
            }
        },
        {
            Header: 'Fecha Inicio',
            accessor: row => {
              if(row.started_at){
                let dayName = row.started_at ? getDateDayName(row.started_at) : '';
                return (<p className="text-center">{row.started_at}, {dayName}</p>);
              }else if(row.completada_at&&row.estado>1){
                let dayName = row.completada_at ? getDateDayName(row.completada_at) : '';
                return (<p className="text-center">{row.completada_at}, {dayName}</p>);
              }
            }
        },
        {
            Header: 'Fecha Completada',
            accessor: row => {
              let dayName = row.completada_at ? getDateDayName(row.completada_at) : '';
              return (<p className="text-center">{row.completada_at}, {dayName}</p>)
            }
        },
        {
            Header: 'A Tiempo',
            accessor: tarea => {
              return (<p className={`text-center ${tarea.aTiempoColor}`}><b>{tarea.aTiempo}</b></p>);
            }
        },
        {
            Header: 'Fecha Creación',
            accessor: row => {
              let dayName = getDateDayName(row.created_at);
              return (<p className="text-center">{row.created_at}, {dayName}</p>)
            }
        },
        {
            Header: 'A Tiempo',
            hide: true,
            accessor: 'aTiempo'
        }
    ],
    []
  );

  const loadTareas = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getTypesHomework(null, (respTH)=>{ 
      let dataTypesHomeworkC = [];
      respTH.data.map(typeHomework=>{
        dataTypesHomeworkC.push({
          value: typeHomework.id,
          label: typeHomework.nombre
        });
      });
      
      setDataTiposTarea(dataTypesHomeworkC);

      dispatch(getHomeworks(null, (respHW)=>{ 

        let newAccessModule = accessModule;
        respHW.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

        setAccessModule(newAccessModule);
        
        setDataTareas(respHW.data);
        setDataTareasFiltered(respHW.data);

        dispatch(getClientUsers(null, (respCU)=>{ 
          let dataUserC = [];
          respCU.data.map(userK=>{
            dataUserC.push({
              value: userK.id,
              label: (userK.nombre||userK.email)
            });
          });
          
          setDataUsers(dataUserC);
          
          dispatch(getZones(null, (respZo)=>{
            setDataZones(respZo.data);

            dispatch(getProperties(null, (respPr)=>{ 
              setDataProperties(respPr.data);

              setLoadingText('');
            }));
          }));
        }));
      }));
    }));
  };

  const validateRangeDate = (dateIni, dateEnd, dateToValidate)=>{
    dateIni = new Date(dateIni);
    dateEnd = new Date(dateEnd);
    dateToValidate = new Date(dateToValidate);
    
    return dateToValidate >= dateIni && dateToValidate <= dateEnd;
  };

  const filterTareas = ()=>{
    let newDataTareasFiltered = [];
    
    let filterUser = false;
    let filterState = false;
    let filterPriority = false;
    let filterAtTime = false;
    let filterSchedule = false;
    let aTiempo = '';
    
    dataTareas.map((tarea)=>{
      filterUser = ( userTareaFiltro.value==0 || (tarea.id_usuario_responsable==userTareaFiltro.value) );
      filterState = ( estadoTareaFiltro.value==4 || (tarea.estado==estadoTareaFiltro.value) );
      filterPriority = ( prioridadTareaFiltro.value==4 || (tarea.prioridad==prioridadTareaFiltro.value) );
      filterAtTime = true;
      filterSchedule = true;

      if(programadaInicialTareaFiltro && programadaFinalTareaFiltro){
        filterSchedule = validateRangeDate(programadaInicialTareaFiltro, programadaFinalTareaFiltro, tarea.programada_at_init) || validateRangeDate(programadaInicialTareaFiltro, programadaFinalTareaFiltro, tarea.programada_at_end);
      }

      if(aTiempoTareaFiltro.value!=4){
        aTiempo = '';
        if(tarea.completada_at){
          if(new Date(tarea.completada_at)<=new Date(tarea.programada_at_end)){
            aTiempo = 'SI';
          }else{
            aTiempo = 'NO';
          }
        }else if(new Date()>new Date(tarea.programada_at_end)){
          aTiempo = 'EN MORA';
        }
        filterAtTime = (aTiempoTareaFiltro.label==aTiempo);
      }

      console.log(aTiempoTareaFiltro);
      
      if(filterUser&&filterState&&filterPriority&&filterAtTime&&filterSchedule){
        newDataTareasFiltered.push(tarea);
      }
    });
    
    setDataTareasFiltered(newDataTareasFiltered);
  };

  const toolbarOptions = {
    options: ['inline', 'fontSize', 'fontFamily', 'list', 'textAlign'],
    inline: {
      options: ['bold', 'italic', 'underline'],
    },
    list: {
      options: ['unordered', 'ordered'],
    },
    textAlign: {
      options: ['left', 'center', 'right', 'justify'],
    },
    fontFamily: {
      options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
    },
  };

  const onEditorStateChange = (editorState) => {
    setDescripcion(editorState);
  };

  useEffect(()=>{
    loadTareas();
  },[]); 
  
  useEffect(()=>{
    filterTareas();
  },[userTareaFiltro, estadoTareaFiltro, prioridadTareaFiltro, aTiempoTareaFiltro, programadaInicialTareaFiltro, programadaFinalTareaFiltro]); 

  const cancelTareaMasiva = ()=>{
    setNuevaTareaMasiva(false);
    setLoadingText(false);
    setLoadingMasivo(false);

    setTipoTareaMasiva(null);
    setPrioridadTareaMasiva({ label: "BAJA", value: "0" });
    setUserTareaMasiva(null);
    setDiasTareaMasiva(null);
    setDescripcionTareaMasiva(null);

    validationTareaMasiva.handleReset();
  }; 
  
  let classCreateBtn = accessModule.CREAR==true ? "primary" : "secondary";
  let classDeleteBtn = accessModule.ELIMINAR==true ? "danger" : "secondary";

  const validationTareaMasiva = useFormik({
    enableReinitialize: true,
    initialValues: {
      'tarea-masiva-fecha-desde': '',
      'tarea-masiva-fecha-hasta': '',
      'tarea-masiva-hora-inicial': '',
      'tarea-masiva-hora-final': ''
    },
    validationSchema: Yup.object({
      'tarea-masiva-fecha-desde': Yup.date().required("Por favor ingrese la fecha desde"),
      'tarea-masiva-fecha-hasta': Yup.date().required("Por favor ingrese la fecha hasta"),
      'tarea-masiva-hora-inicial': Yup.string().required("Por favor ingrese la hora inicial"),
      'tarea-masiva-hora-final': Yup.string().required("Por favor ingrese la hora final")
    }),
    onSubmit: (values) => {
      let tareaMasivaValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('tarea-masiva-','');
        fieldName = fieldName.replaceAll('-','_');

        tareaMasivaValues[fieldName] = fieldValue.replaceAll(",","").replaceAll(".","");

        fieldName = '';
        fieldValue = '';
      });

      if(!tipoTareaMasiva){
        toastr.error("Seleccione el tipo de tarea.", "Error en la validación");
        return;
      }
      
      if(!userTareaMasiva){
        toastr.error("Seleccione el usuario.", "Error en la validación");
        return;
      }

      if(!prioridadTareaMasiva){
        toastr.error("Seleccione la prioridad.", "Error en la validación");
        return;
      }
      
      if(new Date(tareaMasivaValues["fecha_desde"])>=new Date(tareaMasivaValues["fecha_hasta"])){
        toastr.error("La fecha hasta debe ser mayor a la fecha desde", "Error en la validación");
        return;
      }
      
      if(new Date("2022-03-17 "+tareaMasivaValues["hora_inicial"])>=new Date("2022-03-17 "+tareaMasivaValues["hora_final"])){
        toastr.error("La hora inicial debe ser mayor a la final", "Error en la validación");
        return;
      }
      
      if(!diasTareaMasiva){
        toastr.error("Debe marcar mínimo un día de la semana", "Error en la validación");
        return;
      }
      
      let descripcionTextarea = convertToRaw(descripcionTareaMasiva.getCurrentContent());
      
      let validateDescriptionHomework = false;
      descripcionTextarea.blocks.map((block)=>{
        if((block?.text || '').trim()!='') validateDescriptionHomework = true;
      });
      if(!validateDescriptionHomework){
        toastr.error("Por favor digite la descripción de la tarea", "Error de validación");
        return;
      }

      let contentRaw = descripcionTextarea;
      contentRaw = JSON.stringify(contentRaw);

      tareaMasivaValues["id_tipo_tarea"] = tipoTareaMasiva.value;
      tareaMasivaValues["id_usuario_responsable"] = userTareaMasiva.value;
      tareaMasivaValues["prioridad"] = prioridadTareaMasiva.value;
      tareaMasivaValues["dias"] = diasTareaMasiva;
      tareaMasivaValues["descripcion_tarea"] = contentRaw;
      tareaMasivaValues["estado"] = "0";
      tareaMasivaValues["id_inmueble"] = "";
      tareaMasivaValues["id_inmueble_zona"] = "";

      setLoadingMasivo(true);

      dispatch(createHomeworkMassive(tareaMasivaValues, (response)=>{
        if(response.success){
          cancelTareaMasiva();
          loadTareas();
          toastr.success("Tareas creadas masivamente.", "Operación Ejecutada");
        }else{
          setLoadingMasivo(false);
          toastr.error((response.error||"Error al intentar registrar las tareas, por favor intente más tarde."), "Error en la operación");
        }
      }));
    }
  });

  const validationTareaEliminarMasiva = useFormik({
    enableReinitialize: true,
    initialValues: {
      'tarea-eliminar-masiva-fecha': ''
    },
    validationSchema: Yup.object({
      'tarea-eliminar-masiva-fecha': Yup.date().required("Por favor ingrese la fecha de creación")
    }),
    onSubmit: (values) => {
      let tareaEliminarMasivoValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('tarea-eliminar-masiva-','');
        fieldName = fieldName.replaceAll('-','_');

        tareaEliminarMasivoValues[fieldName] = fieldValue.replaceAll(".","").replaceAll(",","");

        fieldName = '';
        fieldValue = '';
      });

      if(!tipoTareaEliminarMasiva){
        toastr.error("Seleccione el tipo de tarea.", "Error en la validación");
        return;
      }
      
      if(!userTareaEliminarMasiva){
        toastr.error("Seleccione el usuario.", "Error en la validación");
        return;
      }

      if(!estadoTareaEliminarMasiva){
        toastr.error("Seleccione el estado.", "Error en la validación");
        return;
      }

      tareaEliminarMasivoValues["id_tipo_tarea"] = tipoTareaEliminarMasiva.value;
      tareaEliminarMasivoValues["id_usuario_responsable"] = userTareaEliminarMasiva.value;
      tareaEliminarMasivoValues["estado"] = estadoTareaEliminarMasiva.value;
      
      setLoadingEliminarTareaMasiva(true);

      dispatch(deleteHomeworkMassive(tareaEliminarMasivoValues, (response)=>{
        if(response.success){
          cancelEliminarTareaMasiva();
          loadTareas();
          toastr.success("Tareas eliminadas masivamente.", "Operación Ejecutada");
        }else{
          setLoadingEliminarTareaMasiva(false);
          toastr.error((response.error||"Error al intentar eliminar las tareas, por favor intente más tarde."), "Error en la operación");
        }
      }));
    }
  });

  const changeDay = (a) => {
    let dayValue = 0;

    switch(a.target.alt){
      case "lunes": dayValue = 1; break;
      case "martes": dayValue = 2; break;
      case "miercoles": dayValue = 4; break;
      case "jueves": dayValue = 8; break;
      case "viernes": dayValue = 16; break;
      case "sabado": dayValue = 32; break;
      case "domingo": dayValue = 64; break;
    }

    if(dayValue>0){
      validationTareaMasiva.setFieldValue("tarea-masiva-dias", "");
    }

    if(!(diasTareaMasiva&dayValue)){
      dayValue = (diasTareaMasiva+dayValue);
      setDiasTareaMasiva(dayValue);
    }else if((diasTareaMasiva&dayValue)){
      dayValue = (diasTareaMasiva-dayValue);
      setDiasTareaMasiva(dayValue);
    }
  };

  const cancelEliminarTareaMasiva = ()=>{
    setEliminarTareaMasiva(false);
    setLoadingEliminarTareaMasiva(false);

    setUserTareaEliminarMasiva(null);
    setTipoTareaEliminarMasiva(null);

    validationTareaEliminarMasiva.handleReset();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="CRM" breadcrumbItem="Tareas" />
          {accessModule.CREAR==true && enableForm==true &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{editTareaId===false ? 'Nueva Tarea' : 'Editando Tarea'}</CardTitle>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        
                        validation.submitForm();

                        return false;
                      }}>
                      <Row>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Tarea *</label>
                          <div className="col-md-12">
                            <RemoteCombo 
                              value={tipoTarea}
                              data={dataTiposTarea}
                              onChange={(val)=>setTipoTarea(val)}
                            />
                          </div>
                        </Col>
                        <Col md={3}>
                          <label className="col-md-12 col-form-label">Usuario responsable *</label>
                          <div className="col-md-12">
                            <RemoteCombo 
                              value={user}
                              data={dataUsers}
                              onChange={(val)=>setUser(val)}
                            />
                          </div>
                        </Col>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Programada para (Inicio)*</label>
                          <div className="col-md-12">
                            <Input
                              type="datetime-local"
                              className="form-control"
                              name="tarea-fecha-programada-inicial"
                              value={validation.values['tarea-fecha-programada-inicial'] || ""}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched['tarea-fecha-programada-inicial'] && validation.errors['tarea-fecha-programada-inicial'] && !validation.values['tarea-fecha-programada-inicial'] ? true : false
                              }
                            />
                            {validation.touched['tarea-fecha-programada-inicial'] && validation.errors['tarea-fecha-programada-inicial'] && !validation.values['tarea-fecha-programada-inicial'] ? (
                              <FormFeedback type="invalid">{validation.errors['tarea-fecha-programada-inicial']}</FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Programada para (Final)*</label>
                          <div className="col-md-12">
                            <Input
                              type="datetime-local"
                              className="form-control"
                              name="tarea-fecha-programada-final"
                              value={validation.values['tarea-fecha-programada-final'] || ""}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched['tarea-fecha-programada-final'] && validation.errors['tarea-fecha-programada-final'] && !validation.values['tarea-fecha-programada-final'] ? true : false
                              }
                            />
                            {validation.touched['tarea-fecha-programada-final'] && validation.errors['tarea-fecha-programada-final'] && !validation.values['tarea-fecha-programada-final'] ? (
                              <FormFeedback type="invalid">{validation.errors['tarea-fecha-programada-final']}</FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Estado *</label>
                          <div className="col-md-12">
                            <Select
                                value={estado}
                                onChange={value=>setEstado(value)}
                                options={[
                                  { label: "PENDIENTE", value: "0" },
                                  { label: "COMPLETADA", value: "1" },
                                  { label: "CANCELADA", value: "2" }
                                ]}
                                className="select2-selection"
                            />
                          </div>
                        </Col>
                        <Col md={1}>
                          <label className="col-md-12 col-form-label">Prioridad *</label>
                          <div className="col-md-12">
                            <Select
                                value={prioridad}
                                onChange={value=>setPrioridad(value)}
                                options={[
                                  { label: "BAJA", value: "0" },
                                  { label: "MEDIA", value: "1" },
                                  { label: "ALTA", value: "2" }
                                ]}
                                className="select2-selection"
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        {/*<Col md={4}>
                          <label className="col-md-12 col-form-label">Zona Inmueble</label>
                          <div className="col-md-12">
                            <RemoteCombo 
                              value={zone}
                              disabled={(property?true:false)}
                              data={dataZones}
                              onChange={(val)=>setZone(val)}
                            />
                          </div>
                        </Col>
                        <Col md={5}>
                          <label className="col-md-12 col-form-label">Inmueble</label>
                          <div className="col-md-12">
                              <RemoteCombo 
                                value={property}
                                disabled={(zone?true:false)}
                                data={dataProperties}
                                onChange={(val)=>setProperty(val)}
                              />
                          </div>
                            </Col>*/}
                      </Row>
                      <Row>
                        <Col md={12}>
                            <label className="col-md-12 col-form-label">Descripción Tarea *</label>
                            <div className="col-md-12">
                              <Editor 
                                editorState={descripcion}
                                toolbar={toolbarOptions}
                                editorStyle={{ height: '100px' }}
                                onEditorStateChange={onEditorStateChange}
                              />
                            </div>
                        </Col>
                      </Row>
                      <br />
                      <br />
                      <Row>
                        <Col md={12} className="text-end">
                          {
                            loadingText=="Guardando ..." ?
                              (
                                <>
                                  <br />
                                  <Spinner className="ms-12" color="dark" />
                                </>
                              )
                            :
                              (<>
                                <Button type="reset" color="warning" onClick={cancelTarea} >
                                  Cancelar
                                </Button>
                                {" "}
                                <Button type="submit" color="primary">
                                  Grabar
                                </Button>
                              </>)
                          }
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>)
          }

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR TAREAS</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR TAREAS</b></p></Col></Row></Card>)}
          

          {accessModule.CREAR==true && !loadingText && enableForm==false &&(
              <Row>
                <Col xl={3}>
                  <Button onClick={()=>setEnableForm(true)} color="primary">
                    <i className="bx bx-folder-plus" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Nueva tarea
                  </Button>
                </Col>
                <Col xl={4}>
                  <Button color={classCreateBtn} onClick={()=>{ 
                      if(accessModule.CREAR==true){
                        setNuevaTareaMasiva(true);
                      }else{
                        toastr.options = { positionClass: 'toast-top-right' };
                        toastr.warning("No tienes acceso a crear Tareas", "Permisos");
                      }
                    }}>
                      <i className="bx bx-add-to-queue" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      Asignar tareas masivamente
                  </Button>
                </Col>
                <Col xl={4}>
                  <Button color={classDeleteBtn} onClick={()=>{ 
                      if(accessModule.ELIMINAR==true){
                        setEliminarTareaMasiva(true); 
                      }else{
                        toastr.options = { positionClass: 'toast-top-right' };
                        toastr.warning("No tienes acceso a eliminar Tareas", "Permisos");
                      }
                    }}>
                      <i className="bx bx-trash" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      Eliminar tareas masivamente
                  </Button>
                </Col>
                <br/>
                <br/>
                <br/>
              </Row>
            )}

          {accessModule.INGRESAR==true&&!loadingText && enableForm==false&&(<Card>
            <Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">FILTROS</CardTitle>
                    <Form onSubmit={(e) => { e.preventDefault(); return false; }}>
                      <Row>
                        <Col md={3}>
                          <label className="col-md-12 col-form-label">Usuario responsable</label>
                          <div className="col-md-12">
                            <RemoteCombo 
                              value={userTareaFiltro}
                              data={[{label: 'TODOS', value: '0'}, ...dataUsers]}
                              onChange={(val)=>setUserTareaFiltro(val)}
                            />
                          </div>
                        </Col>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Estado</label>
                          <div className="col-md-12">
                            <Select
                                value={estadoTareaFiltro}
                                onChange={value=>setEstadoTareaFiltro(value)}
                                options={[
                                  { label: "PENDIENTE", value: "0" },
                                  { label: "COMPLETADA", value: "1" },
                                  { label: "CANCELADA", value: "2" },
                                  { label: "INICIADA", value: "3" },
                                  { label: "TODOS", value: "4" },
                                ]}
                            />
                          </div>
                        </Col>
                        <Col md={1}>
                          <label className="col-md-12 col-form-label">Prioridad</label>
                          <div className="col-md-12">
                            <Select
                                value={prioridadTareaFiltro}
                                onChange={value=>setPrioridadTareaFiltro(value)}
                                options={[
                                  { label: "BAJA", value: "0" },
                                  { label: "MEDIA", value: "1" },
                                  { label: "ALTA", value: "2" },
                                  { label: "TODAS", value: "4" }
                                ]}
                                className="select2-selection"
                            />
                          </div>
                        </Col>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">A Tiempo</label>
                          <div className="col-md-12">
                            <Select
                                value={aTiempoTareaFiltro}
                                onChange={value=>setATiempoTareaFiltro(value)}
                                options={[
                                  { label: "SI", value: "0" },
                                  { label: "NO", value: "1" },
                                  { label: "EN MORA", value: "2" },
                                  { label: "TODOS", value: "3" }
                                ]}
                                className="select2-selection"
                            />
                          </div>
                        </Col>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Programada para (Inicio)</label>
                          <div className="col-md-12">
                            <Input
                              type="datetime-local"
                              className="form-control"
                              value={programadaInicialTareaFiltro}
                              onChange={(e)=>setProgramadaInicialTareaFiltro(e.target.value)}
                            />
                          </div>
                        </Col>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Programada para (Final)</label>
                          <div className="col-md-12">
                            <Input
                              type="datetime-local"
                              className="form-control"
                              value={programadaFinalTareaFiltro}
                              onChange={(e)=>setProgramadaFinalTareaFiltro(e.target.value)}
                            />
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>)}

          {
            accessModule.INGRESAR==true && !loadingText && enableForm==false ?
            (
              <div className="" style={{borderRadius: 18, backgroundColor: '#FFFFFF', padding: 10}}>
                <TableContainer
                  columns={columns}
                  data={dataTareasFiltered}
                  isGlobalFilter={true}
                  isAddOptions={false}
                  customPageSize={10}
                  customPageSizeOptions={true}
                  className="custom-header-css"
                />
              </div>
            )
          :
          (<Row>
            <Col xl={12}>
              <Card>
                <Row>
                  <Col md={12} style={{textAlign: 'center'}}>
                    {
                      loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando tarea..." ?
                      (
                        <>
                          <br />
                          <br />
                          <span>{loadingText}</span>
                          <br />
                          <br />
                          <Spinner className="ms-12" color="dark" />
                          <br />
                          <br />
                        </>
                      )
                      :
                      (<></>)
                    }
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>)
          }
        </Container>
      </div>
      
      {/*MODAL ELIMINAR TAREA*/}
      <Modal
        isOpen={confirmModalEliminarTarea}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarTarea(false);
              setConfirmModalEliminarTarea(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar la tarea <b>{(confirmEliminarTarea!==false ? confirmEliminarTarea.tipoTareaText : '')}</b>?.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteTareaConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarTarea(false);
            setConfirmModalEliminarTarea(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL ELIMINAR TAREA*/}

      
      {/*MODAL VER TAREA*/}
      <Modal
        isOpen={(modalViewTarea?true:false)}
        backdrop={'static'}
        size={'lg'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">{modalViewTarea?.titulo}</h5>
          <button type="button" className="btn-close"
            onClick={()=>setModalViewTarea(false)} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <Row>
            <Col md={12} className="text-start">
              <b>Asignada a:</b> {modalViewTarea?.tarea?.usuarioText}
            </Col>
          </Row>
          <br />
          <Row>
            <Col md={6} className="text-start">
              <b>Programada para (Inicial):</b> {modalViewTarea?.tarea?.programada_at_init}
            </Col>
            <Col md={6} className="text-end">
              <b>Programada para (Final):</b> {modalViewTarea?.tarea?.programada_at_end}
            </Col>
          </Row>
          <br />
          <Row>
            <Col md={6} className="text-start">
              <b>Estado Tarea:</b> <u>{modalViewTarea?.tarea?.estadoText}</u>
            </Col>
            <Col md={6} className="text-end">
              <b>Prioridad Tarea:</b> <u>{modalViewTarea?.tarea?.prioridadText}</u>
            </Col>
          </Row>
          <br />
          <Row>
            <Col md={6} className="text-start">
              <b>Descripción tarea:</b>
            </Col>
          </Row>
        </div>
        <div className="modal-body" dangerouslySetInnerHTML={{ __html: modalViewTarea?.descripcion }} />
        {
          (modalViewTarea?.tarea?.estado>=1||modalViewTarea?.tarea?.completada_at)&&(<div className="modal-body">
            <hr/>
            <Row>
              <Col md={6} className="text-start">
                <b>Fecha Completada:</b> <u>{modalViewTarea?.tarea?.completada_at}</u>
              </Col>
              <Col md={6} className="text-end">
                <b>A Tiempo:</b> <b className={modalViewTarea?.tarea?.aTiempoColor}>{modalViewTarea?.tarea?.aTiempo}</b>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6} className="text-start">
                <b>Observación usuario responsable:</b>
              </Col>
            </Row>
            <br />
            <div className="modal-body" dangerouslySetInnerHTML={{ __html: modalViewTarea?.observacion_completada }} />
          </div>)
        }
        {(
            modalViewTarea?.tarea?.imagenView ?
            (<p className="text-center">
              <img
                data-dz-thumbnail=""
                className="avatar-xxl rounded bg-light"
                alt={modalViewTarea?.tarea?.imagenView}
                src={modalViewTarea?.tarea?.imagenView}
              />
            </p>)
            :
            (<></>)
        )}
        <div className="modal-footer">
          <button type="button" className="btn btn-light" onClick={()=>setModalViewTarea(false)}>CERRAR</button>
        </div>
      </Modal>
      {/*MODAL VER TAREA*/}



      {/*MODAL CREAR TAREA MASIVA*/}
      <Modal
        isOpen={nuevaTareaMasiva}
        size="xl"
        backdrop={'static'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">{'Asociar tarea masivamente'}</h5>
          {!loadingMasivo&&(<button type="button" className="btn-close"
            onClick={() => {
              cancelTareaMasiva();
            }} aria-label="Close"></button>)}
        </div>
        <div className="modal-body">
        {/*FORM CONCEPTO MASIVO*/}
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                
                validationTareaMasiva.submitForm();

                return false;
              }}>
                <Row>
                  <Col md={4}>
                      <label className="col-md-12 col-form-label">Tipo Tarea *</label>
                      <div className="col-md-12">
                        <RemoteCombo
                            value={tipoTareaMasiva}
                            onChange={value=>setTipoTareaMasiva(value)}
                            data={dataTiposTarea}
                          />
                      </div>
                  </Col>
                  <Col md={2}>
                    <label className="col-md-12 col-form-label">Prioridad *</label>
                    <div className="col-md-12">
                      <Select
                          value={prioridadTareaMasiva}
                          onChange={value=>setPrioridadTareaMasiva(value)}
                          options={[
                            { label: "BAJA", value: "0" },
                            { label: "MEDIA", value: "1" },
                            { label: "ALTA", value: "2" }
                          ]}
                          className="select2-selection"
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <label className="col-md-12 col-form-label">Usuario responsable *</label>
                    <div className="col-md-12">
                      <RemoteCombo 
                        value={userTareaMasiva}
                        data={dataUsers}
                        onChange={(val)=>setUserTareaMasiva(val)}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={3}>
                      <label className="col-md-12 col-form-label">Asignada Desde *</label>
                      <div className="col-md-12">
                          <Input
                            type="date"
                            className="form-control"
                            name="tarea-masiva-fecha-desde"
                            value={validationTareaMasiva.values['tarea-masiva-fecha-desde'] || ""}
                            onChange={validationTareaMasiva.handleChange}
                            onBlur={validationTareaMasiva.handleBlur}
                            invalid={
                              validationTareaMasiva.touched['tarea-masiva-fecha-desde'] && validationTareaMasiva.errors['tarea-masiva-fecha-desde'] && !validationTareaMasiva.values['tarea-masiva-fecha-desde'] ? true : false
                            }
                          />
                          {validationTareaMasiva.touched['tarea-masiva-fecha-desde'] && validationTareaMasiva.errors['tarea-masiva-fecha-desde'] && !validationTareaMasiva.values['tarea-masiva-fecha-desde'] ? (
                            <FormFeedback type="invalid">{validationTareaMasiva.errors['tarea-masiva-fecha-desde']}</FormFeedback>
                          ) : null}
                      </div>
                  </Col>
                  <Col md={3}>
                      <label className="col-md-12 col-form-label">Asignada Hasta *</label>
                      <div className="col-md-12">
                          <Input
                            type="date"
                            className="form-control"
                            name="tarea-masiva-fecha-hasta"
                            value={validationTareaMasiva.values['tarea-masiva-fecha-hasta'] || ""}
                            onChange={validationTareaMasiva.handleChange}
                            invalid={
                              validationTareaMasiva.touched['tarea-masiva-fecha-hasta'] && validationTareaMasiva.errors['tarea-masiva-fecha-hasta'] && !validationTareaMasiva.values['tarea-masiva-fecha-hasta'] ? true : false
                            }
                          />
                          {validationTareaMasiva.touched['tarea-masiva-fecha-hasta'] && validationTareaMasiva.errors['tarea-masiva-fecha-hasta'] && !validationTareaMasiva.values['tarea-masiva-fecha-hasta'] ? (
                            <FormFeedback type="invalid">{validationTareaMasiva.errors['tarea-masiva-fecha-hasta']}</FormFeedback>
                          ) : null}
                      </div>
                  </Col>
                  <Col md={3}>
                    <label className="col-md-12 col-form-label">Hora inicio de cada tarea*</label>
                    <div className="col-md-12">
                      <Input
                        type="time"
                        className="form-control"
                        name="tarea-masiva-hora-inicial"
                        value={validationTareaMasiva.values['tarea-masiva-hora-inicial'] || ""}
                        onChange={validationTareaMasiva.handleChange}
                        onBlur={validationTareaMasiva.handleBlur}
                        invalid={
                          validationTareaMasiva.touched['tarea-masiva-hora-inicial'] && validationTareaMasiva.errors['tarea-masiva-hora-inicial'] && !validationTareaMasiva.values['tarea-masiva-hora-inicial'] ? true : false
                        }
                      />
                      {validationTareaMasiva.touched['tarea-masiva-hora-inicial'] && validationTareaMasiva.errors['tarea-masiva-hora-inicial'] && !validationTareaMasiva.values['tarea-masiva-hora-inicial'] ? (
                        <FormFeedback type="invalid">{validationTareaMasiva.errors['tarea-masiva-hora-inicial']}</FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                  <Col md={3}>
                    <label className="col-md-12 col-form-label">Hora finalización de cada tarea*</label>
                    <div className="col-md-12">
                      <Input
                        type="time"
                        className="form-control"
                        name="tarea-masiva-hora-final"
                        value={validationTareaMasiva.values['tarea-masiva-hora-final'] || ""}
                        onChange={validationTareaMasiva.handleChange}
                        onBlur={validationTareaMasiva.handleBlur}
                        invalid={
                          validationTareaMasiva.touched['tarea-masiva-hora-final'] && validationTareaMasiva.errors['tarea-masiva-hora-final'] && !validationTareaMasiva.values['tarea-masiva-hora-final'] ? true : false
                        }
                      />
                      {validationTareaMasiva.touched['tarea-masiva-hora-final'] && validationTareaMasiva.errors['tarea-masiva-hora-final'] && !validationTareaMasiva.values['tarea-masiva-hora-final'] ? (
                        <FormFeedback type="invalid">{validationTareaMasiva.errors['tarea-masiva-hora-final']}</FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row>
                    <Col md={3}>
                      <label className="col-md-12 col-form-label"></label>
                      <div className="form-check mb-3" style={{paddingLeft: 0}}>
                        <label className="form-check-label">Días asignados para la tarea: </label>
                      </div>
                    </Col>
                    <Col md={1}>
                        <label className="col-md-12 col-form-label"></label>
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            alt="lunes"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['vehiculo-fecha-autoriza']}
                            checked={((diasTareaMasiva&1) ? true : false)}
                            id="inmueble-visitante-dia-lunes"
                            name="inmueble-visitante-dia-lunes"
                          />
                          <label className="form-check-label" htmlFor="inmueble-visitante-dia-lunes" >
                            Lunes
                          </label>
                        </div>
                    </Col>
                    <Col md={1}>
                        <label className="col-md-12 col-form-label"></label>
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            alt="martes"
                            checked={((diasTareaMasiva&2) ? true : false)}
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['vehiculo-fecha-autoriza']}
                            id="inmueble-visitante-dia-martes"
                            name="inmueble-visitante-dia-martes"
                          />
                          <label className="form-check-label" htmlFor="inmueble-visitante-dia-martes" >
                            Martes
                          </label>
                        </div>
                    </Col>
                    <Col md={1} style={{marginRight: 20}}>
                        <label className="col-md-12 col-form-label"></label>
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={((diasTareaMasiva&4) ? true : false)}
                            alt="miercoles"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['vehiculo-fecha-autoriza']}
                            id="inmueble-visitante-dia-miercoles"
                            name="inmueble-visitante-dia-miercoles"
                          />
                          <label className="form-check-label" htmlFor="inmueble-visitante-dia-miercoles" >
                          Miércoles
                          </label>
                        </div>
                    </Col>
                    <Col md={1}>
                        <label className="col-md-12 col-form-label"></label>
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={((diasTareaMasiva&8) ? true : false)}
                            alt="jueves"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['vehiculo-fecha-autoriza']}
                            id="inmueble-visitante-dia-jueves"
                            name="inmueble-visitante-dia-jueves"
                          />
                          <label className="form-check-label" htmlFor="inmueble-visitante-dia-jueves" >
                          Jueves
                          </label>
                        </div>
                    </Col>
                    <Col md={1}>
                        <label className="col-md-12 col-form-label"></label>
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={((diasTareaMasiva&16) ? true : false)}
                            alt="viernes"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['vehiculo-fecha-autoriza']}
                            id="inmueble-visitante-dia-viernes"
                            name="inmueble-visitante-dia-viernes"
                          />
                          <label className="form-check-label" htmlFor="inmueble-visitante-dia-viernes" >
                          Viernes
                          </label>
                        </div>
                    </Col>
                    <Col md={1}>
                        <label className="col-md-12 col-form-label"></label>
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={((diasTareaMasiva&32) ? true : false)}
                            alt="sabado"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['vehiculo-fecha-autoriza']}
                            id="inmueble-visitante-dia-sabado"
                            name="inmueble-visitante-dia-sabado"
                          />
                          <label className="form-check-label" htmlFor="inmueble-visitante-dia-sabado" >
                          Sábado
                          </label>
                        </div>
                    </Col>
                    <Col md={1}>
                        <label className="col-md-12 col-form-label"></label>
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={((diasTareaMasiva&64) ? true : false)}
                            alt="domingo"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['vehiculo-fecha-autoriza']}
                            id="inmueble-visitante-dia-domingo"
                            name="inmueble-visitante-dia-domingo"
                          />
                          <label className="form-check-label" htmlFor="inmueble-visitante-dia-domingo" >
                          Domingo
                          </label>
                        </div>
                    </Col>
                </Row>
                <Row>
                  <Col md={12}>
                      <label className="col-md-12 col-form-label">Descripción Tarea *</label>
                      <div className="col-md-12">
                        <Editor 
                          editorState={descripcionTareaMasiva}
                          toolbar={toolbarOptions}
                          editorStyle={{ height: '100px' }}
                          onEditorStateChange={(editorState)=>setDescripcionTareaMasiva(editorState)}
                        />
                      </div>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={12} className="text-end">
                    {
                      loadingMasivo ?
                        (
                          <>
                            <br />
                            Creando tarea masivamente
                            <br />
                            <br />
                            <Spinner className="ms-12" color="dark" />
                          </>
                        )
                      :
                        (<>
                          <Button type="reset" color="warning" onClick={()=>{ cancelTareaMasiva(false); }} >
                            Cancelar
                          </Button>
                          {" "}
                          <Button type="submit" color="primary">
                            Crear masivamente
                          </Button>
                        </>)
                    }
                  </Col>
                </Row>
            </Form>
        {/*FORM CONCEPTO MASIVO*/}
        </div>
      </Modal>
      {/*MODAL CREAR TAREA MASIVA*/}

      {/*MODAL ELIMINAR TAREA MASIVA*/}
      <Modal
        isOpen={eliminarTareaMasiva}
        size="xl"
        backdrop={'static'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">{'Eliminar tarea masivamente'}</h5>
          {!loadingMasivo&&(<button type="button" className="btn-close"
            onClick={() => {
              cancelEliminarTareaMasiva();
            }} aria-label="Close"></button>)}
        </div>
        <div className="modal-body">
        {/*FORM CONCEPTO MASIVO*/}
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                
                validationTareaEliminarMasiva.submitForm();

                return false;
              }}>
                <Row>
                  <Col md={3}>
                    <label className="col-md-12 col-form-label">Tipo Tarea *</label>
                    <div className="col-md-12">
                      <RemoteCombo
                          value={tipoTareaEliminarMasiva}
                          onChange={value=>setTipoTareaEliminarMasiva(value)}
                          data={dataTiposTarea}
                        />
                    </div>
                  </Col>
                  <Col md={3}>
                    <label className="col-md-12 col-form-label">Usuario responsable *</label>
                    <div className="col-md-12">
                      <RemoteCombo 
                        value={userTareaEliminarMasiva}
                        data={dataUsers}
                        onChange={(val)=>setUserTareaEliminarMasiva(val)}
                      />
                    </div>
                  </Col>
                  <Col md={2}>
                    <label className="col-md-12 col-form-label">Estado *</label>
                    <div className="col-md-12">
                      <Select
                          value={estadoTareaEliminarMasiva}
                          onChange={value=>setEstadoTareaEliminarMasiva(value)}
                          options={[
                            { label: "PENDIENTE", value: "0" },
                            { label: "COMPLETADA", value: "1" },
                            { label: "CANCELADA", value: "2" },
                            { label: "TODOS", value: "3" },
                          ]}
                      />
                    </div>
                  </Col>
                  <Col md={4}>
                      <label className="col-md-12 col-form-label">Fecha Ingreso (En la fecha que se creó)*</label>
                      <div className="col-md-12">
                          <Input
                            type="date"
                            className="form-control"
                            name="tarea-eliminar-masiva-fecha"
                            value={validationTareaEliminarMasiva.values['tarea-eliminar-masiva-fecha'] || ""}
                            onChange={validationTareaEliminarMasiva.handleChange}
                            onBlur={validationTareaEliminarMasiva.handleBlur}
                            invalid={
                              validationTareaEliminarMasiva.touched['tarea-eliminar-masiva-fecha'] && validationTareaEliminarMasiva.errors['tarea-eliminar-masiva-fecha'] && !validationTareaEliminarMasiva.values['tarea-eliminar-masiva-fecha'] ? true : false
                            }
                          />
                          {validationTareaEliminarMasiva.touched['tarea-eliminar-masiva-fecha'] && validationTareaEliminarMasiva.errors['tarea-eliminar-masiva-fecha'] && !validationTareaEliminarMasiva.values['tarea-eliminar-masiva-fecha'] ? (
                            <FormFeedback type="invalid">{validationTareaEliminarMasiva.errors['tarea-eliminar-masiva-fecha']}</FormFeedback>
                          ) : null}
                      </div>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={12} className="text-end">
                    {
                      loadingEliminarTareaMasiva ?
                        (
                          <>
                            <br />
                            Eliminando tareas masivamente
                            <br />
                            <br />
                            <Spinner className="ms-12" color="dark" />
                          </>
                        )
                      :
                        (<>
                          <Button type="reset" color="warning" onClick={()=>{ cancelEliminarTareaMasiva(false); }} >
                            Cancelar
                          </Button>
                          {" "}
                          <Button type="submit" color="primary">
                            Eliminar masivamente
                          </Button>
                        </>)
                    }
                  </Col>
                </Row>
            </Form>
        {/*FORM CONCEPTO MASIVO*/}
        </div>
      </Modal>
      {/*MODAL ELIMINAR TAREA MASIVA*/}
    </React.Fragment>
  );
};

export default withRouter(IndexTareas);

IndexTareas.propTypes = {
  history: PropTypes.object,
};