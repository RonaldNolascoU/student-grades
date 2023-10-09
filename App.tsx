/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {Estudiante} from './types';
import Toast from 'react-native-toast-message';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [data, setData] = useState<Estudiante>({
    carnet: '',
    nombre: '',
    apellido: '',
    calif1: 0,
    calif2: 0,
    calif3: 0,
    promedio: 0,
    resultado: '',
  });
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);

  const showToast = (
    type: 'success' | 'error',
    text1: string,
    text2: string,
  ) => {
    Toast.show({
      type: type,
      text1: text1,
      text2: text2,
      position: 'bottom',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 20,
    });
  };

  const handleChange = (name: keyof Estudiante, value: string) => {
    setData(prev => ({
      ...prev,
      [name]: name.includes('calif') ? parseFloat(value) : value,
    }));
  };
  const esValido = useCallback(() => {
    const {carnet, nombre, apellido, calif1, calif2, calif3} = data;

    // Validar campos vacíos
    if (!carnet || !nombre || !apellido) {
      showToast('error', 'Error', 'Todos los campos son requeridos.');
      return false;
    }

    // Validar caracteres especiales
    const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (regex.test(carnet) || regex.test(nombre) || regex.test(apellido)) {
      showToast(
        'error',
        'Error',
        'No se permiten caracteres especiales en Carnet, Nombres o Apellidos.',
      );
      return false;
    }

    // Validar números en nombres y apellidos
    if (/\d/.test(nombre) || /\d/.test(apellido)) {
      showToast(
        'error',
        'Error',
        'Nombres y Apellidos no deben contener números.',
      );
      return false;
    }

    // Validar calificaciones entre 0 y 10
    if (
      calif1 < 0 ||
      calif1 > 10 ||
      calif2 < 0 ||
      calif2 > 10 ||
      calif3 < 0 ||
      calif3 > 10
    ) {
      showToast(
        'error',
        'Error',
        'Las calificaciones deben estar entre 0 y 10.',
      );
      return false;
    }

    return true;
  }, [data]);

  const agregarEstudiante = () => {
    if (esValido()) {
      const prom = (data.calif1 + data.calif2 + data.calif3) / 3;
      const resultado = prom >= 6 ? 'Aprobado' : 'Reprobado';
      setEstudiantes([...estudiantes, {...data, promedio: prom, resultado}]);
      // Limpiar datos después de agregar
      setData({
        carnet: '',
        nombre: '',
        apellido: '',
        calif1: 0,
        calif2: 0,
        calif3: 0,
        promedio: 0,
        resultado: '',
      });
    } else {
      showToast('error', 'Error', 'Existen errores de validación.');
    }
  };

  return (
    <View style={{flex: 1, zIndex: 1}}>
      <Toast />

      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <Text style={styles.title}>
            Diseño y Programación de Software Multiplataforma
          </Text>
          <Text style={styles.subtitle}>Calificaciones</Text>
          <TextInput
            style={styles.input}
            label="Carnet"
            value={data.carnet}
            onChangeText={value => handleChange('carnet', value)}
          />
          <TextInput
            style={styles.input}
            label="Nombres"
            value={data.nombre}
            onChangeText={value => handleChange('nombre', value)}
          />
          <TextInput
            style={styles.input}
            label="Apellidos"
            value={data.apellido}
            onChangeText={value => handleChange('apellido', value)}
          />
          <TextInput
            style={styles.input}
            label="Calificación 1"
            value={String(data.calif1)}
            onChangeText={value => handleChange('calif1', value)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            label="Calificación 2"
            value={String(data.calif2)}
            onChangeText={value => handleChange('calif2', value)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            label="Calificación 3"
            value={String(data.calif3)}
            onChangeText={value => handleChange('calif3', value)}
            keyboardType="numeric"
          />

          <Button
            onPress={agregarEstudiante}
            style={styles.addButton}
            mode="contained">
            Agregar Estudiante
          </Button>

          <View style={styles.estudianteHeader}>
            <Text style={styles.estudianteData}>Carnet</Text>
            <Text style={styles.estudianteData}>Nombre</Text>
            <Text style={styles.estudianteData}>Promedio</Text>
            <Text style={styles.estudianteData}>Resultado</Text>
          </View>
          <ScrollView>
            {estudiantes.map((est, index) => (
              <View key={index} style={styles.estudianteRow}>
                <Text style={styles.estudianteData}>{est.carnet}</Text>
                <Text style={styles.estudianteData}>
                  {est.nombre} {est.apellido}
                </Text>
                <Text style={styles.estudianteData}>
                  {est.promedio.toFixed(2)}
                </Text>
                <Text
                  style={[
                    styles.estudianteData,
                    est.resultado === 'Aprobado'
                      ? styles.aprobado
                      : styles.reprobado,
                  ]}>
                  {est.resultado}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  input: {
    marginBottom: 5,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 10,
  },
  registerButton: {
    marginTop: 20,
    backgroundColor: '#0067F4',
  },
  promedio: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'gray',
  },
  resultado: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  },
  estudianteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#d5d5d5',
    backgroundColor: '#f2f2f2',
    marginTop: 20,
  },
  estudianteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#d5d5d5',
    paddingVertical: 10,
  },
  estudianteData: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },

  aprobado: {
    color: 'green',
  },
  reprobado: {
    color: 'red',
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#6200ea',
  },
});

export default App;
