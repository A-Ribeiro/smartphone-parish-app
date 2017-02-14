using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.IO;

namespace plugin_op
{
    public class json
    {

        [DataContract(Namespace = "", Name = "plugin")]
        public class Plugin
        {
            [DataMember(Name = "category")]
            public string category { get; set; }
            [DataMember(Name = "name")]
            public string name { get; set; }
            [DataMember(Name = "entry")]
            public string entry { get; set; }
        }

        [DataContract(Namespace = "", Name = "plugins")]
        public class Plugins
        {
            [DataMember(Name = "list")]
            public List<Plugin> list { get; set; }
            public Plugins()
            {
                list = new List<Plugin>();
            }

            public void InsertOrUpdate(Plugin plugin)
            {
                for(int i=0;i < list.Count;i++)
                    if (list[i].category.Equals(plugin.category) && list[i].name.Equals(plugin.name))
                    {
                        list[i].entry = plugin.entry;
                        return;
                    }

                list.Add(plugin);
                Sort();
            }

            public void Remove(Plugin plugin)
            {
                for (int i = 0; i < list.Count; i++)
                    if (list[i].category.Equals(plugin.category) && list[i].name.Equals(plugin.name))
                    {
                        list.RemoveAt( i );
                        return;
                    }
            }

            public void Sort()
            {
                list.Sort(
                    delegate (Plugin a, Plugin b)
                    {
                        return a.category.CompareTo(b.category) * 10000 + a.name.CompareTo(b.name);
                    }
                );
            }
        }

        public static void writeToFile(string outputfile, Plugins list)
        {
            FileStream fs = new FileStream(outputfile, FileMode.Create);
            DataContractJsonSerializer jsonser = new DataContractJsonSerializer(typeof(Plugins));
            jsonser.WriteObject(fs, list);
            fs.Close();
        }


        public static Plugins readFromFile(string inputfile)
        {
            Plugins result = null;

            if (File.Exists(inputfile))
            {
                FileStream fs = new FileStream(inputfile, FileMode.Open);
                DataContractJsonSerializer jsonser = new DataContractJsonSerializer(typeof(Plugins));
                result = (Plugins)jsonser.ReadObject(fs);
                fs.Close();
            }
            else
            {
                result = new Plugins();
            }

            return result;
        }

    }
}
