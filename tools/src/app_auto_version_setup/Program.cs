using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace app_auto_version_setup
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length == 4)
            {
                //open config file
                string[] configFile = File.ReadAllLines(args[0]);
                string aplication_name = configFile[0];
                string package = configFile[1];
                int version_code = int.Parse(configFile[2]);
                int version_name = int.Parse(configFile[3]);
                
                //setup the gradle config file
                string[] gradleConfigFile = File.ReadAllLines(args[1]);
                for (int i = 0; i < gradleConfigFile.Length; i++)
                {
                    if (gradleConfigFile[i].Contains("applicationId"))
                        gradleConfigFile[i] = "        applicationId \"" + package + "\"";
                    else if (gradleConfigFile[i].Contains("versionCode"))
                        gradleConfigFile[i] = "        versionCode " + version_code.ToString();
                    else if (gradleConfigFile[i].Contains("versionName"))
                        gradleConfigFile[i] = "        versionName \"1." + version_name.ToString("000") + "\"";
                }
                File.WriteAllLines(args[1], gradleConfigFile);

                //setup strings XML
                File.WriteAllText(args[2], "<resources>\n    <string name=\"app_name\">" + aplication_name + "</string>\n</resources>\n");
                
                //save config file
                version_code++;
                version_name++;
                configFile[2] = version_code.ToString();
                configFile[3] = version_name.ToString();
                File.WriteAllLines(args[0],configFile);


                List<string> javascriptBuiltin = new List<string>(File.ReadAllLines(args[3]));

                javascriptBuiltin.Add("var GooglePlayURL = \"https://play.google.com/store/apps/details?id=" + package + "\";" );

                File.WriteAllLines( args[3], javascriptBuiltin.ToArray() );



            }
        }
    }
}
